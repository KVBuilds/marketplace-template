import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white h-20 relative">
      <div className="border-t border-gray-200 max-w-7xl mx-auto py-4"> 
        <div className="h-full flex flex-col md:flex-row md:justify-between justify-center items-center mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left pb-2 md:pb-0">
            <p className="leading-5 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex space-x-8">
              <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-gray-600">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
