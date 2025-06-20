/**
 * Watermark component with animated SVG logo
 */
import React from 'react';
import { Box, Typography } from '@mui/material';

const Watermark = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 10, sm: 20 },
        right: { xs: 10, sm: 20 },
        zIndex: 1000,
        opacity: { xs: 0.1, sm: 0.15 },
        transition: 'all 0.3s ease',
        '&:hover': {
          opacity: 0.4,
          transform: 'scale(1.02)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(100, 181, 246, 0.05) 100%)',
          backdropFilter: 'blur(15px)',
          borderRadius: 4,
          p: { xs: 1.5, sm: 2.5 },
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }
        }}
      >
        {/* Custom SVG Logo */}
        <Box
          sx={{
            width: { xs: 50, sm: 60 },
            height: { xs: 50, sm: 60 },
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
            }
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Rotating Outer Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#watermarkOuterGradient)"
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.7"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="25s"
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Static Outer Ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#watermarkStaticRing)"
              strokeWidth="1"
              opacity="0.6"
            />
            
            {/* Inner Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#watermarkBackgroundGradient)"
              stroke="url(#watermarkBorderGradient)"
              strokeWidth="1"
              opacity="0.8"
            />
            
            {/* Compass Points */}
            <g opacity="0.9">
              <polygon
                points="50,12 53,30 50,35 47,30"
                fill="url(#watermarkPointGradient)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.5"
              />
              <polygon
                points="50,88 53,70 50,65 47,70"
                fill="url(#watermarkPointGradient)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.5"
              />
              <polygon
                points="88,50 70,47 65,50 70,53"
                fill="url(#watermarkPointGradient)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.5"
              />
              <polygon
                points="12,50 30,47 35,50 30,53"
                fill="url(#watermarkPointGradient)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.5"
              />
            </g>
            
            {/* Center Circle with Checkmark */}
            <circle
              cx="50"
              cy="50"
              r="18"
              fill="url(#watermarkCenterGradient)"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              opacity="0.9"
            />
            
            {/* Checkmark */}
            <path
              d="M43 50 L47 54 L57 44"
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Subtle inner glow */}
            <circle
              cx="50"
              cy="50"
              r="15"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              opacity="0.5"
            />
            
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="watermarkOuterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                <stop offset="50%" stopColor="rgba(100,181,246,0.5)" />
                <stop offset="100%" stopColor="rgba(25,118,210,0.3)" />
              </linearGradient>
              
              <linearGradient id="watermarkStaticRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="100%" stopColor="rgba(227,242,253,0.4)" />
              </linearGradient>
              
              <radialGradient id="watermarkBackgroundGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="70%" stopColor="rgba(100,181,246,0.15)" />
                <stop offset="100%" stopColor="rgba(25,118,210,0.1)" />
              </radialGradient>
              
              <linearGradient id="watermarkBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="100%" stopColor="rgba(100,181,246,0.3)" />
              </linearGradient>
              
              <linearGradient id="watermarkPointGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="50%" stopColor="rgba(227,242,253,0.6)" />
                <stop offset="100%" stopColor="rgba(187,222,251,0.4)" />
              </linearGradient>
              
              <radialGradient id="watermarkCenterGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(102,187,106,0.8)" />
                <stop offset="100%" stopColor="rgba(46,125,50,0.6)" />
              </radialGradient>
            </defs>
          </svg>
        </Box>
          {/* Logo Text */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '1px',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              lineHeight: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.3,
            }}
          >
            <Box component="span">REGU</Box>
            <Box 
              component="span" 
              sx={{ 
                color: '#64b5f6',
                fontWeight: 700,
              }}
            >
              SCAN
            </Box>
            <Box 
              component="span" 
              sx={{ 
                fontSize: '0.65rem',
                opacity: 0.9,
              }}
            >
              PRO
            </Box>
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#90caf9',
              fontWeight: 500,
              fontSize: '0.6rem',
              letterSpacing: '0.8px',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              lineHeight: 1.2,
              display: 'block',
              mt: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Enterprise Suite
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Watermark;
