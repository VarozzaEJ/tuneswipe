import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

export default function ExpiredTokenDialog({ open }) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-primary w-5/6 rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Please Login Again</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link to={"/"} className="w-full sm:w-auto flex justify-center">
            <AlertDialogAction
              className={
                "hover:bg-accent hover:text-accent-foreground bg-transparent border-none"
              }
            >
              Continue
            </AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
