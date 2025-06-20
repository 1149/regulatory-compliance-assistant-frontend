/**
 * Navigation Bar Component
 * 
 * Professional header with glassmorphism design featuring:
 * - Custom SVG compliance icon with hover animations
 * - Gradient background with backdrop blur effects
 * - Clean typography for brand identity
 */
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Navbar() {
  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.95) 0%, rgba(25, 118, 210, 0.9) 50%, rgba(30, 136, 229, 0.95) 100%)',
      backdropFilter: 'blur(15px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      }
    }}>
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexGrow: 1,
          gap: 2
        }}>
          <Box
            sx={{
              width: 45,
              height: 45,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              '&:hover': {
                transform: 'scale(1.15) rotate(10deg)',
                filter: 'drop-shadow(0 6px 12px rgba(25, 118, 210, 0.4))',
              }
            }}
          >
            <svg
              width="45"
              height="45"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rotating Outer Ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#outerGradient)"
                strokeWidth="2"
                strokeDasharray="10 5"
                opacity="0.6"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </circle>
              
              {/* Static Outer Ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#staticRing)"
                strokeWidth="1"
                opacity="0.8"
              />
              
              {/* Inner Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="url(#backgroundGradient)"
                stroke="url(#borderGradient)"
                strokeWidth="1"
              />
              
              {/* Compass Points (4-pointed star) */}
              <g>
                {/* North Point */}
                <polygon
                  points="50,12 53,30 50,35 47,30"
                  fill="url(#pointGradient)"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="0.5"
                />
                {/* South Point */}
                <polygon
                  points="50,88 53,70 50,65 47,70"
                  fill="url(#pointGradient)"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="0.5"
                />
                {/* East Point */}
                <polygon
                  points="88,50 70,47 65,50 70,53"
                  fill="url(#pointGradient)"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="0.5"
                />
                {/* West Point */}
                <polygon
                  points="12,50 30,47 35,50 30,53"
                  fill="url(#pointGradient)"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="0.5"
                />
              </g>
              
              {/* Center Circle with Checkmark */}
              <circle
                cx="50"
                cy="50"
                r="18"
                fill="url(#centerGradient)"
                stroke="#ffffff"
                strokeWidth="2"
              />
              
              {/* Checkmark - Professional compliance symbol */}
              <path
                d="M43 50 L47 54 L57 44"
                fill="none"
                stroke="#ffffff"
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
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                opacity="0.6"
              />
              
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#64b5f6" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#1976d2" stopOpacity="0.5" />
                </linearGradient>
                
                <linearGradient id="staticRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#e3f2fd" stopOpacity="0.6" />
                </linearGradient>
                
                <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                  <stop offset="70%" stopColor="rgba(100, 181, 246, 0.2)" />
                  <stop offset="100%" stopColor="rgba(25, 118, 210, 0.1)" />
                </radialGradient>
                
                <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
                  <stop offset="100%" stopColor="rgba(100, 181, 246, 0.4)" />
                </linearGradient>
                
                <linearGradient id="pointGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#e3f2fd" />
                  <stop offset="100%" stopColor="#bbdefb" />
                </linearGradient>
                
                <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#66bb6a" />
                  <stop offset="100%" stopColor="#2e7d32" />
                </radialGradient>
              </defs>
            </svg>
          </Box>
          
          {/* App Title */}
          <Box>            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica", "Arial", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #e8f0fe 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.8px',
                textShadow: '0 3px 6px rgba(0,0,0,0.25)',
                lineHeight: 1.1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -3,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  borderRadius: '1px',
                }
              }}            >
              <Box component="span" sx={{ fontWeight: 700 }}>
                Compliance
              </Box>
              <Box 
                component="span" 
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  ml: 0.8
                }}
              >
                Navigator
              </Box>
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: '"Inter", "Roboto", sans-serif',
                color: '#90caf9',
                fontWeight: 500,
                fontSize: '0.7rem',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                opacity: 0.85,
                display: 'block',
                mt: -0.3,
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              Regulatory Intelligence Platform
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;