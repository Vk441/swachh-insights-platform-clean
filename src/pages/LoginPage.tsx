import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Recycle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@swachbot.gov.in");
  const [password, setPassword] = useState("admin123");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5" />
      <Card className="relative w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary mb-3">
            <Recycle className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-display text-2xl">SwachBot</CardTitle>
          <CardDescription>Smart Waste Management Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo credentials pre-filled • No real authentication
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
