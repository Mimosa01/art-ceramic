import { useRouter } from "next/navigation";
import { useCallback, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "Неверный email или пароль.";
  }
  if (m.includes("email not confirmed")) {
    return "Подтвердите email по ссылке из письма.";
  }
  if (m.includes("too many requests")) {
    return "Слишком много попыток. Подождите немного.";
  }
  return message;
}

export function useAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError(null);
      setSubmitting(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          setFormError(mapAuthError(error.message));
          return;
        }
        setPassword("");
        router.refresh();
        router.replace("/admin");
      } finally {
        setSubmitting(false);
      }
    },
    [email, password, router],
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    formError,
    submitting,
    onSubmit,
  };
}
