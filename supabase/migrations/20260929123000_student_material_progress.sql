create table if not exists public.student_material_progress (
  student_id bigint not null references public.student(id) on delete cascade,
  material_id bigint not null references public.learning_material(material_id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (student_id, material_id)
);

do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) and not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'student_material_progress'
  ) then
    execute 'alter publication supabase_realtime add table public.student_material_progress';
  end if;
end
$$;

alter table public.student_material_progress enable row level security;

grant select, insert, update, delete
  on public.student_material_progress to authenticated;

drop policy if exists "Students can view their material progress"
  on public.student_material_progress;
create policy "Students can view their material progress"
  on public.student_material_progress for select to authenticated
  using (
    exists (
      select 1 from public.student
      where student.id = student_id and student.auth_id = auth.uid()
    )
  );

drop policy if exists "Students can create their material progress"
  on public.student_material_progress;
create policy "Students can create their material progress"
  on public.student_material_progress for insert to authenticated
  with check (
    exists (
      select 1 from public.student
      where student.id = student_id and student.auth_id = auth.uid()
    )
  );

drop policy if exists "Students can update their material progress"
  on public.student_material_progress;
create policy "Students can update their material progress"
  on public.student_material_progress for update to authenticated
  using (
    exists (
      select 1 from public.student
      where student.id = student_id and student.auth_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.student
      where student.id = student_id and student.auth_id = auth.uid()
    )
  );

drop policy if exists "Students can delete their material progress"
  on public.student_material_progress;
create policy "Students can delete their material progress"
  on public.student_material_progress for delete to authenticated
  using (
    exists (
      select 1 from public.student
      where student.id = student_id and student.auth_id = auth.uid()
    )
  );