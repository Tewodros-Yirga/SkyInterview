// app/notebook/new/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNote } from "../actions";
import Image from "next/image";

const templates = [
  {
    id: "strengths",
    title: "My Strengths",
    icon: "/assets/Module Icon — Candidate Notebook.png",
  },
  {
    id: "weaknesses",
    title: "Safe Weaknesses",
    icon: "/assets/Module Icon — Dashboard  Progress.png",
  },
  {
    id: "stories",
    title: "Competency Stories",
    icon: "/assets/Interview Coaching Illustration (STAR Method).png",
  },
  {
    id: "self-assessment",
    title: "Self-Assessment Notes",
    icon: "/assets/Notebook Background Texture.png",
  },
];

export default function NewNotePage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Note</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Blank Note</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createNote} className="space-y-4">
              <div>
                <Label htmlFor="title">Note Title</Label>
                <Input name="title" placeholder="Enter title..." required />
              </div>
              <Button type="submit" className="w-full">
                Create Blank Note
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Or choose a template</h2>
          <div className="grid gap-4">
            {templates.map((t) => (
              <form key={t.id} action={createNote}>
                <input type="hidden" name="template" value={t.id} />
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 text-left"
                >
                  <div className="flex gap-4 items-center">
                    <div className="relative w-12 h-12">
                      <Image
                        src={t.icon}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{t.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Pre-structured for Ethiopian Airlines
                      </p>
                    </div>
                  </div>
                </Button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
