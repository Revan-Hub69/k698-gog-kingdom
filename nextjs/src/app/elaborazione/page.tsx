'use client';

import React, { useEffect, useState } from 'react';

export default function ElaborazionePage() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch farm data from the API
    fetch('/api/farms')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setFarms(data);
        } else {
          setFarms([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#9ca3af',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <p>Loading farm data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#ef4444',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  // Filter farms with forge and M5 > 0
  const farmsWithForge = farms.filter(farm => 
    farm.crystalForge && (farm.m5Ranged || 0) > 0
  );

  // Calculations
  const totalFarmsWithForge = farmsWithForge.length;
  const totalHitsPerWeek = totalFarmsWithForge * 2; // 2 hits per farm per week
  const totalM5 = farmsWithForge.reduce((sum, farm) => {
    // Each hit = 150k M5, max 2 hits per farm = 300k M5 per farm
    return sum + Math.min((farm.m5Ranged || 0), 300000);
  }, 0);
  
  const totalTroops = farmsWithForge.reduce((sum, farm) => sum + (farm.pelicanoTroops || 0), 0);
  
  // Talent: 4 uses per week, each heals 10% of troops
  const talentUses = 4;
  const talentHealPct = 0.1;
  const troopsHealedByTalent = Math.floor(totalTroops * talentUses * talentHealPct);
  const remainingTroops = totalTroops - troopsHealedByTalent;
  
  // Crystals needed: 1 crystal per remaining troop
  const crystalsNeeded = remainingTroops;
  
  // Crystal production: 190k per farm with forge per week
  const crystalsPerWeek = totalFarmsWithForge * 190000;
  
  // Time needed to produce crystals
  const weeksNeeded = crystalsNeeded / crystalsPerWeek;
  const daysNeeded = weeksNeeded * 6.5; // 6.5 days per week
  
  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
  };
  
  const formatDecimal = (num) => {
    return num.toFixed(2);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#1f2937',
        marginBottom: '1.5rem'
      }}>Elaborazione Risorse Settimanali</h1>
      
      <div style={{ 
        background: '#f8fafc', 
        borderRadius: '0.5rem', 
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          color: '#374151', 
          marginBottom: '1rem',
          fontSize: '1.25rem'
        }}>Dati Base</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem'
        }}>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Farm con Forgia + M5</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>{totalFarmsWithForge}</p>
          </div>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Colpi Totali/Settimana</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>{totalHitsPerWeek} (2 per farm)</p>
          </div>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>M5 Totali Disponibili</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>{formatNumber(totalM5)} (150k per colpo)</p>
          </div>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Totale Truppe in Ospedale</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>{formatNumber(totalTroops)}</p>
          </div>
        </div>
      </div>
      
      <div style={{ 
        background: '#f0f9ff', 
        borderRadius: '0.5rem', 
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          color: '#1e40af', 
          marginBottom: '1rem',
          fontSize: '1.25rem'
        }}>Curare le Truppe</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem'
        }}>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Usi Talento/Settimana</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>{talentUses}</p>
          </div>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Truppe Curate Gratis (40%)</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>{formatNumber(troopsHealedByTalent)}</p>
          </div>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Truppe Rimanenti</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>{formatNumber(remainingTroops)}</p>
          </div>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Cristalli Necessari (1/truppa)</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>{formatNumber(crystalsNeeded)}</p>
          </div>
        </div>
      </div>
      
      <div style={{ 
        background: '#f0fdf4', 
        borderRadius: '0.5rem', 
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          color: '#166534', 
          marginBottom: '1rem',
          fontSize: '1.25rem'
        }}>Produzione Cristalli</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem'
        }}>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Cristalli/Settimana per Farm</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>190k</p>
          </div>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Produzione Settimanale Totale</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>{formatNumber(crystalsPerWeek)}</p>
          </div>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Tempo Necessario</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>
              {formatDecimal(weeksNeeded)} settimane 
              ({formatDecimal(daysNeeded)} giorni)
            </p>
          </div>
          <div>
            <p style={{ 
              margin: '0.25rem 0', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Confronta Produzione vs Necessario</p>
            <p style={{ 
              margin: '0', 
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>
              {crystalsPerWeek >= crystalsNeeded ? 
                '✅ Abbastanza cristalli' : 
                '❌ Cristalli insufficienti'}
            </p>
          </div>
        </div>
      </div>
      
      {totalFarmsWithForge > 0 && (
        <div style={{ 
          background: '#fffbeb', 
          borderRadius: '0.5rem', 
          padding: '1.5rem'
        }}>
          <h2 style={{ 
            color: '#92400e', 
            marginBottom: '1rem',
            fontSize: '1.25rem'
          }}>Farm Analizzate</h2>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0
          }}>
            {farmsWithForge.map(farm => (
              <li key={farm.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.5rem 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <span style={{ 
                  fontWeight: '500',
                  color: '#374151'
                }}>{farm.castleName}</span>
                <span style={{ 
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  M5: {formatNumber(farm.m5Ranged || 0)} | 
                  Truppe: {formatNumber(farm.pelicanoTroops || 0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}