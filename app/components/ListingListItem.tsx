import { Heart } from "lucide-react";
import { formatPrice } from "~/utils";
import { Button } from "./ui/button";
import { useFetcher } from "@remix-run/react";
import { Listing } from "~/types";

export default function ListingListItem({
  href,
  price,
  subject,
  thumbnail_image,
  favorite,
  list_id,
}: Pick<Listing, "price" | "subject" | "thumbnail_image" | "list_id"> & {
  href: string;
  favorite: boolean;
}) {
  const fetcher = useFetcher();
  favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : favorite;

  return (
    <div className="space-y-3 max-w-[300px]">
      <div className="relative">
        <fetcher.Form method="post">
          <input type="hidden" name="listingId" value={list_id} />
          <Button
            variant="outline"
            size="icon"
            type="submit"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            name="favorite"
            value={favorite ? "false" : "true"}
            className={`bg-transparent border-none hover:bg-transparent hover:text-red-500 absolute top-4 right-4 ${
              favorite ? "text-red-500 outline-red-500" : "text-muted"
            }`}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </fetcher.Form>
        <img
          src={thumbnail_image}
          width={300}
          height={300}
          className="aspect-square object-cover rounded-md"
        />
      </div>
      <div>
        <div className="font-semibold text-ellipsis overflow-hidden line-clamp-1">
          <a href={href} target="_blank">
            {subject}
          </a>
        </div>
        <div>
          <span className="font-semibold">{formatPrice(price)}</span> month
        </div>
      </div>
    </div>
  );
}
