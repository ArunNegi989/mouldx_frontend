"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditIndexPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    router.replace(`/owner/moulds/${id}/edit/technical`);
  }, [id, router]);

  return null;
}