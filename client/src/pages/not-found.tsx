import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] p-4">
      <Card className="w-full max-w-md rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
        <CardContent className="pt-12 pb-12 px-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-lg border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-4xl font-black text-foreground mb-4">
            404 Not Found
          </h1>

          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Oops! The page you are looking for doesn't exist or might have been
            moved.
          </p>

          <Button
            asChild
            className="w-full bg-primary text-white rounded-lg py-6 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
