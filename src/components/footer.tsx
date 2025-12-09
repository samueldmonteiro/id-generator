import { CardFooter } from './ui/card';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground border-t bg-muted/20 pt-4 pb-6 rounded-b-xl">
      <p className="mb-1">
        © {new Date().getFullYear()} | Todos os direitos reservados - v1.0
      </p>

      <div className="flex items-center justify-center text-xs">
        <GraduationCap className="w-3.5 h-3.5 mr-1 text-muted-foreground/80" />
        <span className="text-muted-foreground/80">
          Desenvolvido por:
        </span>

        <Link
          href="https://www.linkedin.com/in/thomaz-athaide-5546aa293/"
          target="_blank"
          className="ml-1 font-semibold text-foreground/90 hover:text-primary transition-colors flex items-center"
        >
          Thomaz
        </Link>
        <span className="text-muted-foreground/80 mx-1">&</span>
        <Link
          href="https://www.linkedin.com/in/samuel-m-4a4432250/"
          target="_blank"
          className="font-semibold text-foreground/90 hover:text-primary transition-colors flex items-center"
        >
          Samuel
        </Link>
      </div>
    </CardFooter>
  )
}

export default Footer;