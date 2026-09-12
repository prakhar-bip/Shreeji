const fs = require('fs');

let content = fs.readFileSync('src/components/ColorVisualizer.tsx', 'utf8');

// Insert state
content = content.replace(
  '  const [mounted, setMounted] = useState(false);\n\n  useEffect(() => setMounted(true), []);',
  `  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  };`
);

// We should also replace \r\n with \n in the search string just in case
content = content.replace(
  /  const \[mounted, setMounted\] = useState\(false\);\r?\n\r?\n  useEffect\(\(\) => setMounted\(true\), \[\]\);/,
  `  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  };`
);

fs.writeFileSync('src/components/ColorVisualizer.tsx', content);
