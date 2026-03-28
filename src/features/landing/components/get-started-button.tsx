"use client";

import { useState, type ComponentProps, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type GetStartedButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function GetStartedButton({
  children,
  onClick,
  disabled,
  ...props
}: GetStartedButtonProps) {
  const [isOpening, setIsOpening] = useState(false);
  const clerk = useClerk();
  const router = useRouter();

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    try {
      setIsOpening(true);
      await clerk.openSignIn();
    } catch {
      router.push("/sign-in");
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={disabled ?? isOpening}
    >
      {isOpening ? "Opening sign in..." : children ?? "Get started"}
    </Button>
  );
}
