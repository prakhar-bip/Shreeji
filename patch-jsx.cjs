const fs = require('fs');

let content = fs.readFileSync('src/components/ColorVisualizer.tsx', 'utf8');

// 1. Replace the wrapper grid
const search1 = `<div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] lg:items-start">`;
const replace1 = `<div 
            ref={containerRef}
            className={\`grid gap-5 lg:items-start bg-background \${
              isFullscreen 
                ? "p-4 sm:p-6 w-full h-full overflow-y-auto lg:overflow-hidden lg:grid-cols-[minmax(0,1.5fr)_minmax(24rem,1fr)] lg:grid-rows-1" 
                : "mt-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]"
            }\`}
          >`;
content = content.replace(search1, replace1);

// 2. Add flex to the left column so it can grow
const search2 = `<div className="min-w-0">`;
const replace2 = `<div className={\`min-w-0 flex flex-col gap-3 \${isFullscreen ? "lg:h-full" : ""}\`}>`;
content = content.replace(search2, replace2);

// 3. Remove mt-3 from left column children since gap-3 is added
content = content.replace(`<div className="mb-3 grid`, `<div className="grid`);
content = content.replace(`<div className="mt-3 grid grid-cols-2`, `<div className="grid grid-cols-2`);
content = content.replace(`<div className="mt-3 grid min-w-0 grid-cols-2 gap-2">`, `<div className="grid min-w-0 grid-cols-2 gap-2">`);
content = content.replace(`<p className="mt-3 text-sm font-semibold`, `<p className="text-sm font-semibold`);
content = content.replace(`<p className="mt-3 text-xs text-muted-foreground">`, `<p className="text-xs text-muted-foreground">`);

// 4. Add Fullscreen button to the 3D room wrapper and make it flex-1
const search4 = `<div className="relative isolate overflow-hidden rounded-lg border border-border bg-sand shadow-soft">`;
const replace4 = `<div className={\`relative isolate overflow-hidden rounded-lg border border-border bg-sand shadow-soft flex flex-col \${isFullscreen ? 'flex-1' : ''}\`}>
                <Button 
                  type="button"
                  variant="secondary" 
                  size="icon" 
                  className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90"
                  onClick={toggleFullscreen}
                  title="Toggle full screen"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>`;
content = content.replace(search4, replace4);

// 5. Pass className to Room3D to stretch it if in fullscreen
const search5 = `<Room3D colors={roomColors} selectedWall={activeWall} onSelectWall={setActiveWall} />`;
const replace5 = `<Room3D colors={roomColors} selectedWall={activeWall} onSelectWall={setActiveWall} className={\`relative w-full overflow-hidden bg-sand touch-none cursor-move rounded-md \${isFullscreen ? 'flex-1 min-h-[50vh]' : 'aspect-[4/3] min-h-[20rem] sm:min-h-[28rem]'}\`} />`;
content = content.replace(search5, replace5);

// 6. Make the Right Side (Colors) stretch
const search6 = `<div className="min-w-0 rounded-lg border border-border bg-card p-3 md:p-4">`;
const replace6 = `<div className={\`min-w-0 flex flex-col rounded-lg border border-border bg-card p-3 md:p-4 \${isFullscreen ? "lg:h-full lg:overflow-hidden" : ""}\`}>`;
content = content.replace(search6, replace6);

// 7. Make the colors grid scroll properly
const search7 = `<div className="mt-3 grid max-h-[24rem] grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 lg:grid-cols-4" aria-label="Choose an Asian Paints shade">`;
const replace7 = `<div className={\`mt-3 grid grid-cols-4 gap-2 pr-1 sm:grid-cols-6 lg:grid-cols-4 \${isFullscreen ? "flex-1 overflow-y-auto" : "max-h-[24rem] overflow-y-auto"}\`} aria-label="Choose an Asian Paints shade">`;
content = content.replace(search7, replace7);


fs.writeFileSync('src/components/ColorVisualizer.tsx', content);
