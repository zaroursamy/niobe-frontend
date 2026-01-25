import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SmallBadge from "@/components/candidates/SmallBadge";
import { fetchWithRefresh } from "@/lib/auth";
import { BACKEND_URL } from "@/lib/config";

type CandidateCvParsedDialogProps = {
  candidateId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type CandidateCvParsedResponse = {
  filename: string;
  lang?: string | null;
  text?: string | null;
  llm?: CVSchema | null;
  ocr_used: boolean;
};

type Profile = {
  fullName: string;
  summary: string;
  email: string;
  title?: string | null;
  phone?: string | null;
  address?: string | null;
  websites?: string[] | null;
  linkedin?: string | null;
};

type Experience = {
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  achievements?: string[] | null;
};

type Education = {
  institution: string;
  degree: string;
  startDate: string;
  field?: string | null;
  endDate?: string | null;
};

type Skill = {
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert" | null;
  category?: "Hard skill" | "Soft skill" | null;
};

type Language = {
  language: string;
  proficiency?: "Beginner" | "Intermediate" | "Advanced" | "Fluent" | null;
};

type Certification = {
  name: string;
  issuer: string;
  date?: string | null;
  url?: string | null;
};

type Project = {
  name: string;
  description?: string | null;
  technologies?: string[] | null;
  url?: string | null;
};

type CVSchema = {
  profile: Profile;
  experience: Experience[];
  education?: Education[] | null;
  skills?: Skill[] | null;
  languages?: Language[] | null;
  certifications?: Certification[] | null;
  projects?: Project[] | null;
  interests?: string[] | null;
};

export default function CandidateCvParsedDialog({
  candidateId,
  open,
  onOpenChange,
}: CandidateCvParsedDialogProps) {
  const [parsedData, setParsedData] =
    useState<CandidateCvParsedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const parsedNotReadyMessage = "cv parsed data not found";

  const parseErrorMessage = async (
    response: Response,
    fallback: string,
  ): Promise<string> => {
    const text = await response.text();
    if (!text) return fallback;
    try {
      const payload = JSON.parse(text) as { error?: string };
      if (payload?.error) return payload.error;
    } catch {
      // Ignore JSON parse failures and use raw text.
    }
    return text;
  };

  const wait = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  useEffect(() => {
    if (!open) {
      setParsedData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const fetchParsed = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const metaResponse = await fetchWithRefresh(
          `${BACKEND_URL}/candidates/${candidateId}/cvs/first`,
        );
        if (!metaResponse.ok) {
          const message = await parseErrorMessage(
            metaResponse,
            "Failed to load CV",
          );
          throw new Error(message);
        }
        const meta = (await metaResponse.json()) as { cv_id?: string };
        if (!meta.cv_id) {
          throw new Error("No CV available");
        }

        const maxAttempts = 5;
        const retryDelayMs = 1500;

        const fetchParsedData = async (attempt: number): Promise<void> => {
          const parsedResponse = await fetchWithRefresh(
            `${BACKEND_URL}/candidates/${candidateId}/cvs/${meta.cv_id}/parsed`,
          );
          if (parsedResponse.ok) {
            const payload =
              (await parsedResponse.json()) as CandidateCvParsedResponse;
            if (!isActive) return;
            setParsedData(payload);
            return;
          }
          const message = await parseErrorMessage(
            parsedResponse,
            "Failed to load parsed CV",
          );
          if (
            message === parsedNotReadyMessage &&
            attempt < maxAttempts &&
            isActive
          ) {
            await wait(retryDelayMs);
            return fetchParsedData(attempt + 1);
          }
          throw new Error(message);
        };

        await fetchParsedData(0);
      } catch (err) {
        if (!isActive) return;
        const message =
          err instanceof Error ? err.message : "Failed to load parsed CV";
        setError(
          message === parsedNotReadyMessage
            ? "Parsed CV not ready yet. Please try again shortly."
            : message,
        );
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void fetchParsed();

    return () => {
      isActive = false;
    };
  }, [candidateId, open]);

  const llm =
    parsedData?.llm && typeof parsedData.llm === "object"
      ? (parsedData.llm as CVSchema)
      : null;

  const formatDateRange = (start: string, end?: string | null) =>
    end ? `${start} - ${end}` : start;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Parsed CV
            {parsedData ? (
              <>
                <SmallBadge>
                  {parsedData.ocr_used ? "OCR used" : "OCR unused"}
                </SmallBadge>
                {parsedData.lang ? (
                  <SmallBadge>Lang: {parsedData.lang}</SmallBadge>
                ) : null}
              </>
            ) : null}
          </DialogTitle>
          <DialogDescription>
            Raw text extracted from the latest CV.
          </DialogDescription>
          {parsedData?.filename ? (
            <p className="text-xs text-muted-foreground">
              File: {parsedData.filename}
            </p>
          ) : null}
        </DialogHeader>
        <div className="rounded-lg border border-border bg-background p-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading parsed CV...
            </p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : parsedData?.text ? (
            <div className="max-h-[60vh] overflow-auto">
              {llm ? (
                <div className="mt-6 space-y-4 text-sm text-foreground">
                  <h3 className="text-sm font-semibold">Structured profile</h3>
                  <div className="rounded-md border border-border bg-muted/20 p-3">
                    <div className="grid gap-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {llm.profile.fullName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {llm.profile.email}
                      </p>
                      {llm.profile.title ? (
                        <p>
                          <span className="font-medium">Title:</span>{" "}
                          {llm.profile.title}
                        </p>
                      ) : null}
                      {llm.profile.phone ? (
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {llm.profile.phone}
                        </p>
                      ) : null}
                      {llm.profile.address ? (
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {llm.profile.address}
                        </p>
                      ) : null}
                      {llm.profile.linkedin ? (
                        <p>
                          <span className="font-medium">LinkedIn:</span>{" "}
                          {llm.profile.linkedin}
                        </p>
                      ) : null}
                      {llm.profile.websites?.length ? (
                        <p>
                          <span className="font-medium">Websites:</span>{" "}
                          {llm.profile.websites.join(", ")}
                        </p>
                      ) : null}
                      <p className="text-muted-foreground">
                        {llm.profile.summary}
                      </p>
                    </div>
                  </div>

                  {Array.isArray(llm.experience) && llm.experience.length ? (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Experience</h4>
                      <div className="space-y-3">
                        {llm.experience.map((exp, index) => (
                          <div
                            key={`${exp.company}-${exp.position}-${index}`}
                            className="rounded-md border border-border p-3"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <p className="font-medium">
                                {exp.position} @ {exp.company}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateRange(exp.startDate, exp.endDate)}
                              </p>
                            </div>
                            {exp.description ? (
                              <p className="mt-2 text-muted-foreground">
                                {exp.description}
                              </p>
                            ) : null}
                            {exp.achievements?.length ? (
                              <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                                {exp.achievements.map((achievement, idx) => (
                                  <li key={`${achievement}-${idx}`}>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {llm.education?.length ? (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Education</h4>
                      <div className="space-y-3">
                        {llm.education.map((edu, index) => (
                          <div
                            key={`${edu.institution}-${edu.degree}-${index}`}
                            className="rounded-md border border-border p-3"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <p className="font-medium">
                                {edu.degree} @ {edu.institution}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateRange(edu.startDate, edu.endDate)}
                              </p>
                            </div>
                            {edu.field ? (
                              <p className="mt-2 text-muted-foreground">
                                Field: {edu.field}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {llm.skills?.length ? (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {llm.skills.map((skill, index) => (
                          <span
                            key={`${skill.name}-${index}`}
                            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                          >
                            {skill.name}
                            {skill.level ? ` (${skill.level})` : ""}
                            {skill.category ? ` - ${skill.category}` : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {llm.languages?.length ? (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {llm.languages.map((language, index) => (
                          <span
                            key={`${language.language}-${index}`}
                            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                          >
                            {language.language}
                            {language.proficiency
                              ? ` (${language.proficiency})`
                              : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {llm.certifications?.length ? (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">
                        Certifications
                      </h4>
                      <div className="space-y-3">
                        {llm.certifications.map((cert, index) => (
                          <div
                            key={`${cert.name}-${cert.issuer}-${index}`}
                            className="rounded-md border border-border p-3"
                          >
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-muted-foreground">
                              {cert.issuer}
                              {cert.date ? ` - ${cert.date}` : ""}
                            </p>
                            {cert.url ? (
                              <p className="text-muted-foreground">
                                {cert.url}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {llm.projects?.length ? (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Projects</h4>
                      <div className="space-y-3">
                        {llm.projects.map((project, index) => (
                          <div
                            key={`${project.name}-${index}`}
                            className="rounded-md border border-border p-3"
                          >
                            <p className="font-medium">{project.name}</p>
                            {project.description ? (
                              <p className="mt-1 text-muted-foreground">
                                {project.description}
                              </p>
                            ) : null}
                            {project.technologies?.length ? (
                              <p className="mt-1 text-muted-foreground">
                                Tech: {project.technologies.join(", ")}
                              </p>
                            ) : null}
                            {project.url ? (
                              <p className="mt-1 text-muted-foreground">
                                {project.url}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {llm.interests?.length ? (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Interests</h4>
                      <p className="text-muted-foreground">
                        {llm.interests.join(", ")}
                      </p>
                    </div>
                  ) : null}

                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer">View raw JSON</summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                      {JSON.stringify(llm, null, 2)}
                    </pre>
                    <pre className="whitespace-pre-wrap text-sm text-foreground">
                      {parsedData.text}
                    </pre>
                  </details>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No parsed text available.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
