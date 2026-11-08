import { blocksClient } from "./client";

// Account actions for the Descape sign-in, sign-up and reset screens. Each one
// goes through the SDK; IAM decides the rules, so its error text is shown as it is.
// The emailed reset link carries a `code`, which resetPassword needs with the new password.

type IamAnswer = { error?: string; error_description?: string; message?: string };

function failIfRejected(answer: IamAnswer | undefined): void {
  if (answer?.error) throw new Error(answer.error_description ?? answer.error);
}

export async function signUp(email: string, password: string, name: string): Promise<void> {
  const [firstName = "", ...rest] = name.trim().split(/\s+/);
  const answer = await blocksClient.auth.signup({ email, password, firstName, lastName: rest.join(" ") });
  failIfRejected(answer as IamAnswer);
}

// Always resolves the same way, whether or not the address has an account,
// so the screen cannot be used to find out who is registered.
export async function requestPasswordReset(email: string): Promise<void> {
  await blocksClient.auth.recover({ email });
}

export async function resetPassword(code: string, password: string): Promise<void> {
  const answer = await blocksClient.auth.resetPassword({ code, password });
  failIfRejected(answer as IamAnswer);
}
