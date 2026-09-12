const fs = require('fs');

let content = fs.readFileSync('src/components/ColorVisualizer.tsx', 'utf8');

// 1. Grid Wrapper
content = content.replace(
  /<div className="mt-5 grid gap-5 lg:grid-cols-\[minmax\(0,1\.3fr\)_minmax\(20rem,0\.7fr\)\] lg:items-start">/,
  '<div ref={containerRef} className={`transition-colors duration-300 ${isFullscreen ? "fixed inset-0 z-50 bg-background block" : "mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] lg:items-start"}`}>'
);

// 2. Left Side
content = content.replace(
  /<div className="min-w-0">/,
  '<div className={`min-w-0 flex flex-col ${isFullscreen ? "absolute inset-0 z-0" : ""}`}>'
);

// 3. Top Mode Toggle
content = content.replace(
  /<div className="mb-3 grid min-w-0 grid-cols-2 gap-1 rounded-lg bg-muted p-1" aria-label="Choose room">/,
  '<div className={`mb-3 grid min-w-0 grid-cols-2 gap-1 rounded-lg bg-muted p-1 ${isFullscreen ? "hidden" : ""}`} aria-label="Choose room">'
);

// 4. Room3D Wrapper + Fullscreen Button
content = content.replace(
  /<div className="relative isolate overflow-hidden rounded-lg border border-border bg-sand shadow-soft">/,
  `<div className={\`relative isolate overflow-hidden bg-sand shadow-soft \${isFullscreen ? "flex-1 rounded-none border-none" : "rounded-lg border border-border"}\`}>
                <Button 
                  type="button"
                  variant="secondary" 
                  size="icon" 
                  className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90"
                  onClick={toggleFullscreen}
                  title="Toggle full screen"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>`
);

// 5. Room3D aspect ratio inside fullscreen
content = content.replace(
  /<Room3D colors=\{roomColors\} selectedWall=\{activeWall\} onSelectWall=\{setActiveWall\} \/>/,
  '<Room3D colors={roomColors} selectedWall={activeWall} onSelectWall={setActiveWall} className={isFullscreen ? "w-full h-full bg-sand touch-none cursor-move" : undefined} />'
);

// 6. Normal Wall Selector
content = content.replace(
  /<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Choose a wall to paint">/,
  '<div className={`mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 ${isFullscreen ? "hidden" : ""}`} aria-label="Choose a wall to paint">'
);

// 7. Normal Photo & Preview Buttons
content = content.replace(
  /<div className="mt-3 grid min-w-0 grid-cols-2 gap-2">/,
  '<div className={`mt-3 grid min-w-0 grid-cols-2 gap-2 ${isFullscreen ? "hidden" : ""}`}>'
);

// 8. Warning texts
content = content.replace(
  /\{error \? <p className="mt-3 text-sm font-semibold text-destructive">\{error\}<\/p> : null\}/,
  '{error && !isFullscreen ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}'
);
content = content.replace(
  /<p className="mt-3 text-xs text-muted-foreground">/,
  '<p className={`mt-3 text-xs text-muted-foreground ${isFullscreen ? "hidden" : ""}`}>'
);

// 9. Right Side (Color Picker)
content = content.replace(
  /<div className="min-w-0 rounded-lg border border-border bg-card p-3 md:p-4">/,
  `<div className={\`min-w-0 rounded-lg border-border bg-card p-3 md:p-4 \${isFullscreen ? "absolute bottom-4 left-4 right-4 z-10 flex flex-col max-h-[50vh] border bg-background/90 backdrop-blur-lg shadow-2xl overflow-hidden" : "border"}\`}>
              
              {/* Floating Wall Selector in Fullscreen */}
              {isFullscreen && mode === "default" && (
                <div className="mb-3 flex gap-2 overflow-x-auto pb-2 border-b border-border/50 shrink-0" aria-label="Choose a wall to paint">
                  {roomWalls.map((wall) => {
                    const shade = asianPaintsShades.find((item) => item.code === wallShadeCodes[wall.id]);
                    return (
                      <Button
                        key={wall.id}
                        type="button"
                        variant={activeWall === wall.id ? "default" : "outline"}
                        onClick={() => setActiveWall(wall.id)}
                        aria-pressed={activeWall === wall.id}
                        className="h-auto min-h-11 shrink-0 justify-start gap-2 px-2.5 py-2 text-left"
                      >
                        <span className="h-6 w-6 shrink-0 rounded-sm border border-border" style={{ backgroundColor: shade?.hex }} />
                        <span className="min-w-0">
                          <span className="block text-xs font-bold">{wall.label}</span>
                          <span className="block truncate text-[10px] opacity-75">{shade?.name}</span>
                        </span>
                      </Button>
                    );
                  })}
                </div>
              )}`
);

// 10. The Color Grid wrapper
content = content.replace(
  /<div className="mt-3 grid max-h-\[24rem\] grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 lg:grid-cols-4" aria-label="Choose an Asian Paints shade">/,
  `<div className={\`mt-3 \${isFullscreen ? "flex-1 min-h-0 overflow-y-auto pr-1" : "max-h-[24rem] overflow-y-auto pr-1"}\`}>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-4" aria-label="Choose an Asian Paints shade">`
);

// 11. Add closing </div> for the Color Grid wrapper
content = content.replace(
  /                  \}\)\}\r?\n                <\/div>\r?\n              \) : \(/,
  `                  })}
                </div>
                </div>
              ) : (`
);

fs.writeFileSync('src/components/ColorVisualizer.tsx', content);
