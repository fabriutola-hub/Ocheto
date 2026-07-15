import { motion } from 'framer-motion';

export default function CurvedTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-[340px] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1100px] mx-auto lg:mx-0"
    >
      {/* ===== SVG Curved Text ===== */}
      <svg
        viewBox="0 0 600 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
        overflow="visible"
      >
        <defs>
          {/* Desktop curves — shifted left */}
          <path
            id="curve-top-desktop"
            d="M 0 130 Q 250 70 500 130"
          />
          <path
            id="curve-bottom-desktop"
            d="M 0 220 Q 250 280 500 220"
          />
          {/* Mobile curves — centered in viewBox */}
          <path
            id="curve-top-mobile"
            d="M 50 130 Q 300 70 550 130"
          />
          <path
            id="curve-bottom-mobile"
            d="M 50 220 Q 300 280 550 220"
          />
        </defs>

        {/* Desktop version — sits to the left */}
        <g className="hidden lg:block">
          <text
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '150px',
              fontWeight: 900,
              fontStyle: 'italic',
              fill: 'white',
            }}
          >
            <textPath
              href="#curve-top-desktop"
              startOffset="50%"
              textAnchor="middle"
            >
              Ocheto
            </textPath>
          </text>
          <text
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '90px',
              fontWeight: 900,
              fontStyle: 'italic',
              fill: 'white',
            }}
          >
            <textPath
              href="#curve-bottom-desktop"
              startOffset="50%"
              textAnchor="middle"
            >
              Vibes
            </textPath>
          </text>
        </g>

        {/* Mobile version — centered */}
        <g className="lg:hidden">
          <text
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '150px',
              fontWeight: 900,
              fontStyle: 'italic',
              fill: 'white',
            }}
          >
            <textPath
              href="#curve-top-mobile"
              startOffset="50%"
              textAnchor="middle"
            >
              Ocheto
            </textPath>
          </text>
          <text
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '90px',
              fontWeight: 900,
              fontStyle: 'italic',
              fill: 'white',
            }}
          >
            <textPath
              href="#curve-bottom-mobile"
              startOffset="50%"
              textAnchor="middle"
            >
              Vibes
            </textPath>
          </text>
        </g>
      </svg>
    </motion.div>
  );
}