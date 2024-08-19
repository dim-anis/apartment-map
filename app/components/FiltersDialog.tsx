import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import FiltersForm from "./FiltersForm";

export function FiltersDialog({
  onSubmit,
}: {
  onSubmit: (open: boolean) => void;
}) {
  return (
    <DialogContent className="sm:max-w-[425px] z-[9999]">
      <DialogHeader>
        <DialogTitle>Filters</DialogTitle>
        <DialogDescription>
          Apply filters to find the exact match.
        </DialogDescription>
      </DialogHeader>
      <FiltersForm onSubmitForm={onSubmit} />
    </DialogContent>
  );
}
