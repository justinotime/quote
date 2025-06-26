import { EDITORS_PICK } from '@/app/lib/editorsPick';
import Image from 'next/image';

const EditorsPickSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden rounded-none my-0 shadow-none">
      {/* Background Image */}
      <Image
        src={EDITORS_PICK.backgroundImage}
        alt={EDITORS_PICK.headline}
        fill
        className="absolute inset-0 w-full h-full object-cover z-0"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      {/* Editor's Pick Label - Top Left */}
      <div className="absolute top-8 left-8 z-20">
        <div className="border-t-2 border-white/30 pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white/90 uppercase tracking-wider">
            {EDITORS_PICK.title}
          </h1>
        </div>
      </div>

      {/* Content - Bottom Left */}
      <div className="absolute bottom-16 left-16 z-20 flex flex-col gap-3 max-w-xl">
        <span className="text-sm font-xl text-white italic px-2 py-0.5 rounded w-fit">
          {EDITORS_PICK.tag}
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-white/90 mb-1 leading-tight drop-shadow-lg">
          {EDITORS_PICK.headline}
        </h2>
        <p className="text-lg md:text-2xl text-white/80 mb-2 drop-shadow-md">
          {EDITORS_PICK.subheadline}
        </p>
        <span className="text-base md:text-lg text-white/70 font-medium">
          By {EDITORS_PICK.author}
        </span>
      </div>
    </section>
  );
};

export default EditorsPickSection; 