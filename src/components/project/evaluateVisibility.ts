interface VisibilityCondition {
  field: string;
  operator: "eq" | "neq" | "includes" | "exists";
  value: any;
}

export function evaluateVisibility(
  rules: { conditions: VisibilityCondition[] } | undefined,
  context: { userRole?: string; isAuthorized: boolean },
): boolean {
  if (!rules?.conditions || rules.conditions.length === 0) return true;

  return rules.conditions.every((cond) => {
    if (cond.field === "session.user.role") {
      if (cond.operator === "eq") return context.userRole === cond.value;
      if (cond.operator === "neq") return context.userRole !== cond.value;
    }
    if (cond.field === "session.authorized") {
      return cond.operator === "eq" ? context.isAuthorized === cond.value : false;
    }
    return true;
  });
}
