import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, Home, ShieldCheck } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ClipboardList className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">Sistem Kehadiran</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={location.pathname === "/" ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Form
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/admin" ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/admin">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
