  import { cn } from "@/lib/utils";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { PasswordInput } from "@/components/ui/password-input";
  import { useSignupViewModel } from "@/integration/signup-view-model";


  export function SignupForm({ type, className, ...props }) {
    const {
        form,
        loading,
        responseMessage,
        handleChange,
        handleSubmit
      } = useSignupViewModel(type);

      const header = type === "renewal" ? "Renew Membership" : "Create Account";
      localStorage.setItem('membershipType', type === undefined ? "registration": type);

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center p-6 md:p-10 overflow-hidden z-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
              <CardContent className="grid p-0 md:grid-cols-2">
                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">{header}</h1>
                      <p className="text-muted-foreground text-balance">
                        {type === "renewal"
                          ? "Renew your ICON Membership"
                          : "Sign up for your ICON Membership"}
                      </p>
                    </div>

                    {responseMessage && (
                      <div className={`p-3 rounded-md text-sm text-center ${
                        responseMessage.includes('Error') || responseMessage.includes('failed') 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {responseMessage}
                      </div>
                    )}                    

                    <div className="grid gap-3">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="id">ID Number</Label>
                      <Input id="id" type="text" placeholder="XXXXXXX" maxLength={7} value={form.id} onChange={handleChange} required />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@slu.edu.ph" value={form.email} onChange={handleChange} required />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="course">Course</Label>
                      <Input id="course" type="text" placeholder="Course Name (e.g. BSCS)" value={form.course} onChange={handleChange} required />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="year">Year</Label>
                      <Input id="year" type="text" placeholder="Year (e.g. 2)" value={form.year} onChange={handleChange} required />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                  </Button>

                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"></div>

                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <a href="/" className="underline underline-offset-4">
                        Log in
                      </a>
                    </div>
                  </div>
                </form>

                <div className="bg-muted relative hidden md:flex items-center justify-center">
                  <img
                    src="ICON.png"
                    alt="Image"
                    className="h-110 w-110 object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              By clicking continue, you agree to our <a href="/terms-policy?returnTo=/signup">Terms of Service</a>{" "}
              and <a href="/terms-policy?returnTo=/signup">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>
    );
  }
