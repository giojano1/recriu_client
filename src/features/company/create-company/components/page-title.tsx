export default function CreateCompanyPageTitle() {
  return (
    <div className="max-1100:max-w-[400px] max-1050:gap-4 max-950:max-w-full max-950:gap-2 max-950:text-center flex h-full w-full max-w-[500px] flex-col items-center justify-center gap-7">
      <h1 className="max-1050:text-2xl max-1050:leading-8 max-600:text-xl text-4xl leading-12 font-bold">
        We need some of your Company Information
      </h1>
      <p className="text-muted-foreground max-1050:text-sm">
        We use this information to customize your experience and match our tools
        to your company’s needs.
      </p>
    </div>
  );
}
