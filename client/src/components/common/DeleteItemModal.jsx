import CustomButton from "../ui/CustomButton";

export default function DeleteItemModal({ func }) {
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="text-sm text-light-text-primary dark:text-dark-text-primary">
        Are you sure you want to delete this Item?
      </div>

      <CustomButton
        onClick={func}
        variant="red"
        name="Delete"
        className="w-fit self-end text-sm"
      />
    </div>
  );
}
