import { prisma, isDatabaseConfigured } from "@/lib/prisma";

interface CreateAuditLogInput {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  before?: unknown;
  after?: unknown;
}

export async function createAuditLog(input: CreateAuditLogInput) {
  if (!isDatabaseConfigured()) {
    return;
  }

  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? undefined,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? undefined,
        summary: input.summary,
        before: input.before ?? undefined,
        after: input.after ?? undefined,
      },
    });
  } catch (error) {
    console.warn("Audit log write failed:", error);
  }
}
