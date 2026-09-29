import { supabase } from "../lib/supabase";

export async function getCompletedMaterialIds(
  studentId: number,
  materialIds: number[],
): Promise<Set<number>> {
  if (materialIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from("student_material_progress")
    .select("material_id")
    .eq("student_id", studentId)
    .in("material_id", materialIds);

  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => Number(row.material_id)));
}

export async function setMaterialCompleted(
  studentId: number,
  materialId: number,
  completed: boolean,
): Promise<void> {
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