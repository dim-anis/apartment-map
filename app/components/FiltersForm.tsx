import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import {
  json,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { loader } from "~/routes/_index";

const formSchema = z.object({
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  district: z.string(),
  markers: z.array(z.number()),
});

type Form = z.infer<typeof formSchema>;

export default function FiltersForm({
  onSubmitForm,
}: {
  onSubmitForm: (open: boolean) => void;
}) {
  const { regions, markerTypes } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const [searchParams, setSearchParams] = useSearchParams();
  const minPrice = Number(searchParams.get("minPrice") || "0");
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;
  const district = searchParams.get("district") || undefined;
  const markers =
    searchParams
      .get("markers")
      ?.split(",")
      .map((markerId) => Number(markerId)) || [];

  const districts = Object.entries(
    regions.regionFollowId.entities.regions["3017"].area
  ).map(([_, dist_obj]) => dist_obj);

  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minPrice: minPrice,
      maxPrice: maxPrice,
      district: district,
      markers: markers,
    },
  });

  const onSubmit = (formValues: Form) => {
    const { success, data } = formSchema.safeParse(formValues);
    if (success) {
      submit(data);
      onSubmitForm(false);
    }
  };

  return (
    <div className="gap-4 py-4">
      <div className="flex flex-col gap-4 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            action="/"
            className="space-y-8"
          >
            <div className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
              Location
            </div>
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a district" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[9999]">
                      {districts.map((district) => (
                        <SelectItem value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
              Price range
            </div>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum</FormLabel>
                    <FormControl>
                      <Input placeholder="9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="font-heading mt-8 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
              Markers
            </div>
            <FormField
              control={form.control}
              name="markers"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Places of interest
                    </FormLabel>
                    <FormDescription>
                      Select what else matters to you and I'll take that into
                      consideration when searching.
                    </FormDescription>
                  </div>
                  {markerTypes.map((markerType) => (
                    <FormField
                      key={markerType.id}
                      control={form.control}
                      name="markers"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={markerType.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(markerType.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        markerType.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== markerType.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {markerType.type_name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Show</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
