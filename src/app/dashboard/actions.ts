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

  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    company,
    position,
    job_link: jobLink || null,
    status: "basvuruldu",
  });

  if (error) {
    console.error(error);
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