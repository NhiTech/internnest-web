"use client";

import { useState } from "react";

const CITIES = [
  "San Francisco",
  "New York",
  "Boston",
  "Chicago",
  "Atlanta",
  "Seattle",
  "Los Angeles",
  "Washington, DC",
];

export default function SignupPage() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    schoolEmail: "",
    city: CITIES[0],
    company: "",
    startDate: "",
    endDate: "",
    budget: "",
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm({ ...form, [k]: e.target.value });

  const eduValid = /\.edu\s*$/i.test(form.schoolEmail.trim());

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to Supabase Auth (.edu magic link) + save profile.
    if (typeof window !== "undefined") {
      localStorage.setItem("internnest_signup", JSON.stringify(form));
    }
    setDone(true);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <a href="/" className="text-sm text-slate-500 hover:underline">
        ← Back to InternNest
      </a>

      {done ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="text-3xl">🪺</div>
          <h1 className="mt-2 text-xl font-bold">You&apos;re on the nest list!</h1>
          <p className="mt-2 text-sm text-slate-600">
            Next up (coming soon): we&apos;ll verify your <b>.edu</b> email and drop
            you into your city&apos;s listings + community.
          </p>
          <a
            href="/"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Browse housing →
          </a>
        </div>
      ) : (
        <>
          <h1 className="mt-6 text-2xl font-extrabold">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tell us the basics so we can match you to housing and your city&apos;s
            intern community. (More profile details later — this is the quick start.)
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Full name">
              <input
                required
                value={form.name}
                onChange={set("name")}
                className="input"
                placeholder="Jordan Lee"
              />
            </Field>

            <Field label="School email (.edu — used to verify you're a student)">
              <input
                required
                type="email"
                value={form.schoolEmail}
                onChange={set("schoolEmail")}
                className="input"
                placeholder="you@university.edu"
              />
              {form.schoolEmail && !eduValid && (
                <p className="mt-1 text-xs text-amber-600">
                  Use your school&apos;s <b>.edu</b> email for verification.
                </p>
              )}
            </Field>

            <Field label="Internship city">
              <select value={form.city} onChange={set("city")} className="input">
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Company / where you're working">
              <input
                value={form.company}
                onChange={set("company")}
                className="input"
                placeholder="e.g. Meta"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start date">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={set("startDate")}
                  className="input"
                />
              </Field>
              <Field label="End date">
                <input
                  type="date"
                  value={form.endDate}
                  onChange={set("endDate")}
                  className="input"
                />
              </Field>
            </div>

            <Field label="Monthly budget ($)">
              <input
                type="number"
                value={form.budget}
                onChange={set("budget")}
                className="input"
                placeholder="2000"
              />
            </Field>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
            >
              Create account
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
