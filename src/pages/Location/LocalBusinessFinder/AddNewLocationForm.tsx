import React from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAddLocationMutation } from "@/features/location/locationApi"
import { toast } from "react-toastify"

type AddLocationFormProps = {
  // onSubmit: (data: AddLocationFormData) => void
  initialCoordinates: { latitude: number; longitude: number }
  onCloseSidebar:()=>void
}

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  type: z.string().optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
  latitude: z.number().min(-90, "Invalid latitude").max(90, "Invalid latitude").optional(),
  longitude: z.number().min(-180, "Invalid longitude").max(180, "Invalid longitude").optional(),
})

type AddLocationFormData = z.infer<typeof schema>

const AddNewLocationForm: React.FC<AddLocationFormProps> = ({
  initialCoordinates,
  onCloseSidebar
}) => {
  console.log({initialCoordinates})
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddLocationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "",
      address: "",
      contact: "",
    },
  })
  const [addLocation]=useAddLocationMutation()
  const handleFormSubmit = async (data:AddLocationFormData)=>{
    console.log({data})
    try {
      const result = await addLocation({
        ...data,
        ...initialCoordinates
      }).unwrap()
      console.log({ result })
      if (result.created) {
        toast.success("Location added successfully")
      } else {
        toast.error("Event creation failed")
      }
    } catch (error: any) {
      console.log(error)
      toast.error(`Error while creating event ${error?.data?.error}`)
    }
    
  }
  console.log({errors})

  return (
    <div className="backdrop-blur-sm absolute right-6 top-12 z-30 h-[89vh] w-72 dark:bg-gray-950 p-4 rounded-md">
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-4   ">
      <div>
        <label className="block text-sm font-medium">Business Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Business Name" className="mt-1" />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Type (e.g., Restaurant)"
              className="mt-1"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Address" className="mt-1" />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Contact</label>
        <Controller
          name="contact"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Contact Info" className="mt-1" maxLength={10} />
          )}
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium">Latitude</label>
        <Input
          type="number"
          placeholder="Latitude"
          className="mt-1"
          key={initialCoordinates.latitude}
          defaultValue={initialCoordinates.latitude}
          readOnly
        />
      </div>
      <div className="flex-1">
        <Label className="block text-sm font-medium">Longitude</Label>
        <Input type="number" placeholder="Longitude" className="mt-1"
          key={initialCoordinates.longitude}
          defaultValue={initialCoordinates.longitude}
          readOnly
          />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600/60 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
      >
        Save Location
      </Button>
      <Button
        type="button"
        onClick={onCloseSidebar}
        className="w-full bg-red-600/60 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700"
      >
        Close
      </Button>
    </form>
    </div>
  )
}

export default AddNewLocationForm
