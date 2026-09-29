import { supabase } from "./supabase";

export async function getCompletedMaterialIds(studentId, materialIds) {
  if (!studentId || materialIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from("student_material_progress")
    .select("material_id")
    .eq("student_id", studentId)
    .in("material_id", materialIds);

  if (error) {
    const progressTableMissing =
      error.code === "PGRST205" &&
      error.message.includes("public.student_material_progress");

    if (progressTableMissing) {
      console.warn(
        "student_material_progress is not installed yet; showing courses with 0% completion.",
      );
      return new Set();
    }

    throw new Error(error.message);
  }
  return new Set((data ?? []).map((row) => Number(row.material_id)));
}

export async function setMaterialCompleted(studentId, materialId, completed) {
  if (completed) {
    const { error } = await supabase
      .from("student_material_progress")
      .upsert(
        {
          student_id: studentId,
          material_id: materialId,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "student_id,material_id" },
      );

    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabase
    .from("student_material_progress")
    .delete()
    .eq("student_id", studentId)
    .eq("material_id", materialId);

  if (error) throw new Error(error.message);
}

export async function getStudentCourseProgress(studentId) {
  const [courseResult, moduleResult, materialResult] = await Promise.all([
    supabase
      .from("course")
      .select("course_id, courseName, instructor")
      .order("course_id"),
    supabase.from("module").select("module_id, course_id"),
    supabase
      .from("learning_material")
      .select("material_id, module_id, title, fileUrl, fileSize, materialType, isDownloadable, youtubeId"),
  ]);

  const queryError = courseResult.error || moduleResult.error || materialResult.error;
  if (queryError) throw new Error(queryError.message);

  const materials = materialResult.data ?? [];
  const completedMaterialIds = await getCompletedMaterialIds(
    studentId,
    materials.map((material) => Number(material.material_id)),
  );
  const courseByModule = new Map();

  for (const module of moduleResult.data ?? []) {
    courseByModule.set(Number(module.module_id), Number(module.course_id));
  }

  const materialsByCourse = new Map();
  for (const material of materials) {
    const courseId = courseByModule.get(Number(material.module_id));
    if (courseId === undefined) continue;
    if (!materialsByCourse.has(courseId)) materialsByCourse.set(courseId, []);
    materialsByCourse.get(courseId).push({
      ...material,
      material_id: Number(material.material_id),
      isCompleted: completedMaterialIds.has(Number(material.material_id)),
    });
  }

  const courses = (courseResult.data ?? []).map((course) => {
    const courseMaterials = materialsByCourse.get(Number(course.course_id)) ?? [];
    const completedCount = courseMaterials.filter((material) => material.isCompleted).length;

    return {
      ...course,
      id: Number(course.course_id),
      name: course.courseName,
      materials: courseMaterials,
      handouts: courseMaterials.filter((material) => material.materialType === "handout"),
      completedCount,
      totalCount: courseMaterials.length,
      progress: courseMaterials.length
        ? Math.round((completedCount / courseMaterials.length) * 100)
        : 0,
    };
  });

  const totalCount = courses.reduce((total, course) => total + course.totalCount, 0);
  const completedCount = courses.reduce((total, course) => total + course.completedCount, 0);
  const handouts = materials.filter((material) => material.materialType === "handout");
  const completedHandouts = handouts.filter((material) =>
    completedMaterialIds.has(Number(material.material_id)),
  ).length;

  return {
    courses,
    summary: {
      totalCount,
      completedCount,
      overallProgress: totalCount ? Math.round((completedCount / totalCount) * 100) : 0,
      totalHandouts: handouts.length,
      completedHandouts,
      courseCount: courses.length,
      completedCourseCount: courses.filter(
        (course) => course.totalCount > 0 && course.progress === 100,
      ).length,
    },
  };
}
