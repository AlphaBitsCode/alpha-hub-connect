
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [activeTab, setActiveTab] = useState("email");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check for access token in URL hash for redirect-based auth flows
    const handleRedirectResult = async () => {
      if (window.location.hash) {
        setIsProcessing(true);
        toast({
          title: "Processing login",
          description: "Please wait while we authenticate you...",
        });
        
        try {
          // This will fetch the session based on the URL parameters
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error processing auth redirect:", error);
            toast({
              title: "Authentication error",
              description: error.message,
              variant: "destructive",
            });
          } else if (data?.session) {
            toast({
              title: "Signed in successfully",
              description: "Welcome back!",
            });
            navigate("/");
          }
        } catch (err) {
          console.error("Error handling redirect:", err);
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    handleRedirectResult();
  }, [navigate, toast]);
  
  useEffect(() => {
    if (user && !loading && !isProcessing) {
      navigate("/");
    }
  }, [user, loading, navigate, isProcessing]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await signIn(email, "");
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showOtpInput) {
      // Verify the OTP
      setIsProcessing(true);
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: "sms"
        });
        
        if (error) throw error;
        
        if (data.session) {
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
          navigate("/");
        }
      } catch (error: any) {
        toast({
          title: "Verification failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Send the OTP
      setIsProcessing(true);
      try {
        // For testing, you can use the Supabase test number +12345678900 with any OTP
        const { error } = await supabase.auth.signInWithOtp({
          phone,
        });
        
        if (error) throw error;
        
        setShowOtpInput(true);
        toast({
          title: "OTP sent!",
          description: "Check your phone for the verification code. For testing, you can use phone number +12345678900 with any OTP.",
        });
      } catch (error: any) {
        toast({
          title: "Failed to send OTP",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    toast({
      title: "Redirecting to Google",
      description: "Please wait while we connect to Google...",
    });
    await signIn("google", "");
  };

  const resetPhoneFlow = () => {
    setShowOtpInput(false);
    setOtp("");
  };

  if (loading || isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-alphabits-darkblue to-alphabits-teal">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-alphabits-darkblue to-alphabits-teal p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="https://alphabits.team/images/AB_Logo_white_icon.png" 
              alt="Alpha Bits Hub Logo" 
              className="h-16 w-16"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Alpha Bits Hub</h1>
        </div>
        
        <Card className="bg-white rounded-lg border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl text-center text-alphabits-darkblue">Sign in</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <Button
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-sm flex items-center justify-center"
              onClick={handleGoogleSignIn}
              disabled={isProcessing}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>
            
            <Tabs 
              defaultValue="email" 
              className="w-full" 
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                if (value === "phone") {
                  resetPhoneFlow();
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-300"
                      disabled={isProcessing}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-alphabits-teal hover:bg-alphabits-teal/90 text-white"
                    disabled={isProcessing}
                  >
                    Send Magic Link
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="phone">
                <form onSubmit={handlePhoneSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+12345678900"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={showOtpInput || isProcessing}
                      className="border-gray-300"
                    />
                    {showOtpInput && (
                      <div className="pt-2">
                        <Label htmlFor="otp" className="text-gray-700">Verification Code</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          disabled={isProcessing}
                          className="border-gray-300 mt-1"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          For testing, you can use phone number +12345678900 with any OTP
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-alphabits-teal hover:bg-alphabits-teal/90 text-white"
                      disabled={isProcessing}
                    >
                      {showOtpInput ? "Verify Code" : "Send OTP"}
                    </Button>
                    
                    {showOtpInput && (
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={resetPhoneFlow}
                        className="w-full"
                        disabled={isProcessing}
                      >
                        Change Phone Number
                      </Button>
                    )}
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pt-0">
            <div className="text-center text-xs text-gray-500">
              By signing in, you agree to our
              <a href="#" className="text-alphabits-blue ml-1 hover:underline">
                Terms of Service
              </a>
              <span className="mx-1">and</span>
              <a href="#" className="text-alphabits-blue hover:underline">
                Privacy Policy
              </a>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
