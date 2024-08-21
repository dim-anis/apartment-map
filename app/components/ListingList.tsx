import { Listing } from "~/types";
import ListingListItem from "./ListingListItem";
import { createLink } from "~/utils";
import { useState } from "react";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FiltersDialog } from "./FiltersDialog";
import { List, SlidersHorizontal } from "lucide-react";
import { PaginationDemo } from "./Pagination";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/_index";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export default function ListingList({
  data,
  districtName,
}: {
  data: Listing[];
  districtName: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { favorites } = useLoaderData<typeof loader>();
  const favoritesSet = new Set(favorites.map((item) => item.list_id));

  return (
    <Sheet>
      <SheetTrigger className="absolute top-4 left-4 z-[9999]">
        <Button variant="outline" size="icon">
          <List className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="z-[9999] xl:w-auto xl:max-w-none sm:w-[400px] sm:max-w-[540px] overflow-y-auto hidden md:block"
        side="left"
      >
        <div className="space-y-4">
          <SheetHeader>
            <div className="flex flex-row justify-between items-center mt-6">
              <SheetTitle>
                {`${data.length} apartments in ${
                  districtName ? districtName + "," : ""
                } Da Nang, Vietnam`}
              </SheetTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="z-[9999]" variant="outline">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DialogTrigger>
                <FiltersDialog onSubmit={setDialogOpen} />
              </Dialog>
            </div>
          </SheetHeader>

          <div className="grid gap-4 grid-cols-2">
            {data.map((item) => (
              <ListingListItem
                key={item.list_id}
                favorite={favoritesSet.has(item.list_id)}
                list_id={item.list_id}
                thumbnail_image={item.thumbnail_image}
                subject={item.subject}
                price={item.price}
                href={createLink(item.list_id)}
              />
            ))}
          </div>
        </div>
        {/* <PaginationDemo /> */}
      </SheetContent>
    </Sheet>
  );
}
