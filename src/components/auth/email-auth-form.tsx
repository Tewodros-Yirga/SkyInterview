"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof schema>;

type EmailAuthFormProps = {
  mode: "login" | "signup";
};

export function EmailAuthForm({ mode }: EmailAuthFormProps) {
  const router = useRouter();
  const [clientError, setClientError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    let supabaseClient: ReturnType<typeof createSupabaseBrowserClient>;
    try {
      supabaseClient = createSupabaseBrowserClient();
    } catch (error) {
      const message = (error as Error).message;
      setClientError(message);
      form.setError("root", { message });
      return;
    }
    setSuccessMessage(null);
    if (clientError) {
      setClientError(null);
    }

    const { email, password } = values;
    const action =
      mode === "signup"
        ? supabaseClient.auth.signUp({ email, password })
        : supabaseClient.auth.signInWithPassword({ email, password });

    const { error } = await action;

    if (error) {
      form.setError("root", { message: error.message });
      return;
    }

    if (mode === "signup") {
      setSuccessMessage("Account created! Check your inbox for confirmation.");
    } else {
      setSuccessMessage("Welcome back! Redirecting to your dashboard...");
      router.push("/");
      router.refresh();
    }
  };

  const oppositeMode = mode === "login" ? "signup" : "login";
  const heading = mode === "login" ? "Welcome back" : "Create an account";
  const subheading =
    mode === "login"
      ? "Log in to continue practicing interviews and group sessions."
      : "Sign up to unlock the notebook, knowledge modules, and simulators.";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-sky">
          SkyInterview
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
          {heading}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root ? (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <p>{form.formState.errors.root.message}</p>
            </div>
          ) : null}

          {clientError ? (
            <div className="flex items-start gap-2 rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-900 dark:border-yellow-500/30 dark:bg-yellow-900/20 dark:text-yellow-50">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-medium">Configuration missing</p>
                <p className="text-xs opacity-80">{clientError}</p>
              </div>
            </div>
          ) : null}

          {successMessage ? (
            <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-900/20 dark:text-emerald-100">
              <CheckCircle2 className="mt-0.5 h-4 w-4" />
              <p>{successMessage}</p>
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full gap-2 bg-brand-sky text-white shadow-soft-lg hover:bg-brand-sky/90"
            disabled={form.formState.isSubmitting || !!clientError}
          >
            {form.formState.isSubmitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        {mode === "login" ? "New to SkyInterview?" : "Already onboard?"}{" "}
        <Link
          href={oppositeMode === "login" ? "/login" : "/signup"}
          className="font-semibold text-brand-sky hover:underline"
        >
          {oppositeMode === "login" ? "Log in" : "Create an account"}
        </Link>
      </div>
    </div>
  );
}

