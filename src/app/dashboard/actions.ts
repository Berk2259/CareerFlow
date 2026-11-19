"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addApplication(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const company = formData.get("company") as string;
  const position = formData.get("position") as string;
  const jobLink = formData.get("job_link") as string;
  const workMode = formData.get("work_mode") as string;
  const employmentType = formData.get("employment_type") as string;
  const city = formData.get("city") as string;
  const source = formData.get("source") as string;
  const cvType = formData.get("cv_type") as string;
  const companyFollowers = formData.get("company_followers") as string;
  const companyEmployees = formData.get("company_employees") as string;
  const appliedDate = formData.get("applied_date") as string;

  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    company,
    position,
    job_link: jobLink || null,
    work_mode: workMode || null,
    employment_type: employmentType || null,
    city: city || null,
    source: source || null,
    cv_type: cvType || null,
    company_followers: companyFollowers || null,
    company_employees: companyEmployees || null,
    created_at: appliedDate ? new Date(appliedDate).toISOString() : undefined,
    status: "basvuruldu",
  });
  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/dashboard");
}

export async function addTimelineEvent(
  applicationId: string,
  step: {
    stepKey: string;
    title: string;
    meta?: string;
    tag?: string;
    round?: number;
    finalStatus?: string;
  }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: lastEvent } = await supabase
    .from("application_timeline")
    .select("step_key, title")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastEvent && lastEvent.step_key === step.stepKey && lastEvent.title === step.title) {
    return;
  }

  const { error: insertError } = await supabase.from("application_timeline").insert({
    application_id: applicationId,
    step_key: step.stepKey,
    title: step.title,
    meta: step.meta || null,
    tag: step.tag || null,
    round: step.round ?? null,
  });

  if (insertError) {
    console.error(insertError);
    return;
  }

  const newStatus = step.finalStatus ?? "mulakat";

  const { error: updateError } = await supabase
    .from("applications")
    .update({
      status: newStatus,
      current_step_label: step.title,
      current_step_tag: step.tag || null,
    })
    .eq("id", applicationId);

  if (updateError) {
    console.error(updateError);
    return;
  }

  revalidatePath("/dashboard");
}

export async function updateApplicationStatus(id: string, newStatus: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase
    .from("applications")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath("/dashboard");
}