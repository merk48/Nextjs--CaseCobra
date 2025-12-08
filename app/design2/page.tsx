interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
const Page = ({ searchParams }: PageProps) => {
  const { id } = searchParams;
  return (
    <div className="bg-red-800 p-20 text-white">{id ?? "No ID found"}</div>
  );
};

export default Page;
