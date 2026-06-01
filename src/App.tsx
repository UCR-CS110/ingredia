import { useState, useEffect } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { ProductCard } from './components/ProductCard';
import { UserPreferencesModal } from './components/UserPreferencesModal';
import { ScanModal } from './components/ScanModal';
import { AuthPage } from './components/AuthPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('ingredia_session'));
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  function handleLogin(email) {
    localStorage.setItem('ingredia_session', email);
    setCurrentUser(email);
  }

  function handleLogout() {
    localStorage.removeItem('ingredia_session');
    setCurrentUser(null);
  }

  const mockProducts = [
    {
      id: '1',
      name: 'Organic Almond Milk',
      brand: 'Nature\'s Best',
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
      score: 85,
      negatives: [
        {
          icon: 'droplets',
          label: 'Additives',
          value: 'Contains 2 additives',
          severity: 'low'
        }
      ],
      positives: [
        {
          icon: 'droplets',
          label: 'Low in calories',
          value: '30 calories per serving'
        }
      ],
      ingredients: ['Filtered Water', 'Almonds', 'Sea Salt', 'Sunflower Lecithin', 'Gellan Gum', 'Vitamin D2', 'Vitamin E']
    },
    {
      id: '2',
      name: 'Honey Nut Cheerios',
      brand: 'General Mills',
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop',
      score: 32,
      negatives: [
        {
          icon: 'plus',
          label: 'Additives',
          value: 'Contains additives to avoid',
          severity: 'high'
        },
        {
          icon: 'droplets',
          label: 'Sugar',
          value: '12g per serving',
          severity: 'high'
        },
        {
          icon: 'flame',
          label: 'Calories',
          value: '393 Cal per 100g',
          severity: 'medium'
        },
        {
          icon: 'wheat',
          label: 'Sodium',
          value: '671mg - A bit too salty',
          severity: 'medium'
        }
      ],
      positives: [
        {
          icon: 'wheat',
          label: 'Fiber',
          value: '5.6g per serving'
        },
        {
          icon: 'droplets',
          label: 'Protein',
          value: '7.1g per serving'
        }
      ],
      ingredients: ['Whole Grain Oats', 'Sugar', 'Oat Bran', 'Cornstarch', 'Honey', 'Brown Sugar Syrup', 'Salt', 'Tripotassium Phosphate', 'Canola Oil', 'Natural Almond Flavor']
    },
    {
      id: '3',
      name: 'Greek Yogurt',
      brand: 'Chobani',
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
      score: 92,
      negatives: [],
      positives: [
        {
          icon: 'droplets',
          label: 'Protein',
          value: '15g per serving'
        },
        {
          icon: 'wheat',
          label: 'Low sugar',
          value: '4g natural sugars'
        }
      ],
      ingredients: ['Cultured Nonfat Milk', 'Live Active Cultures']
    },
    {
      id: '4',
      name: 'Energy Drink',
      brand: 'Red Bull',
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1622543925917-763c34c1a999?w=400&h=400&fit=crop',
      score: 18,
      negatives: [
        {
          icon: 'droplets',
          label: 'Sugar',
          value: '27g per can',
          severity: 'high'
        },
        {
          icon: 'plus',
          label: 'Additives',
          value: 'Multiple artificial additives',
          severity: 'high'
        },
        {
          icon: 'flame',
          label: 'Caffeine',
          value: 'High caffeine content',
          severity: 'medium'
        }
      ],
      positives: [],
      ingredients: ['Carbonated Water', 'Sucrose', 'Glucose', 'Citric Acid', 'Taurine', 'Sodium Bicarbonate', 'Magnesium Carbonate', 'Caffeine', 'Niacinamide', 'Calcium Pantothenate', 'Pyridoxine HCl', 'Vitamin B12', 'Natural and Artificial Flavors', 'Colors']
    },
    {
      id: '5',
      name: 'Organic Quinoa',
      brand: 'Ancient Harvest',
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      score: 95,
      negatives: [],
      positives: [
        {
          icon: 'wheat',
          label: 'Fiber',
          value: '5g per serving'
        },
        {
          icon: 'droplets',
          label: 'Protein',
          value: '8g per serving'
        }
      ],
      ingredients: ['Organic Quinoa']
    },
    {
      id: '6',
      name: 'Vitamin C Serum',
      brand: 'GlowSkin',
      category: 'Cosmetics',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
      score: 78,
      negatives: [
        {
          icon: 'plus',
          label: 'Preservatives',
          value: 'Contains phenoxyethanol',
          severity: 'low'
        }
      ],
      positives: [
        {
          icon: 'droplets',
          label: 'Antioxidants',
          value: 'Rich in Vitamin C & E'
        }
      ],
      ingredients: ['Ascorbic Acid', 'Hyaluronic Acid', 'Vitamin E', 'Ferulic Acid', 'Aloe Vera', 'Purified Water', 'Phenoxyethanol']
    }
  ];

  useEffect(() => {
    // Show preferences modal on first load
    if (!userPreferences) {
      setShowPreferences(true);
    }
  }, []);

  useEffect(() => {
    // Filter products based on search
    let filtered = mockProducts;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply user preferences to adjust scores
    if (userPreferences) {
      filtered = filtered.map(product => {
        let adjustedScore = product.score;
        const newNegatives = [...product.negatives];

        // Check for allergens
        product.ingredients.forEach(ingredient => {
          userPreferences.allergies.forEach(allergen => {
            if (ingredient.toLowerCase().includes(allergen.toLowerCase())) {
              adjustedScore = Math.max(0, adjustedScore - 30);
              newNegatives.unshift({
                icon: 'plus',
                label: 'Contains allergen',
                value: `Contains ${allergen}`,
                severity: 'high'
              });
            }
          });
        });

        // Check for avoided ingredients
        product.ingredients.forEach(ingredient => {
          userPreferences.avoidIngredients.forEach(avoid => {
            if (ingredient.toLowerCase().includes(avoid.toLowerCase())) {
              adjustedScore = Math.max(0, adjustedScore - 15);
              if (!newNegatives.some(n => n.label === 'Unwanted ingredient')) {
                newNegatives.unshift({
                  icon: 'plus',
                  label: 'Unwanted ingredient',
                  value: `Contains ${avoid}`,
                  severity: 'medium'
                });
              }
            }
          });
        });

        return {
          ...product,
          score: adjustedScore,
          negatives: newNegatives
        };
      });
    }

    setFilteredProducts(filtered);
  }, [searchQuery, userPreferences]);

  const handleSavePreferences = (preferences) => {
    setUserPreferences(preferences);
  };

  const handleProductClick = (productId) => {
    console.log('Product clicked:', productId);
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <NavigationBar
        onSearchChange={setSearchQuery}
        onScanClick={() => setShowScan(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Active Preferences Banner */}
        {userPreferences && (userPreferences.dietaryRestrictions.length > 0 || userPreferences.allergies.length > 0) && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Active Preferences</h3>
              <button
                onClick={() => setShowPreferences(true)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {userPreferences.dietaryRestrictions.map(dr => (
                <span key={dr} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {dr}
                </span>
              ))}
              {userPreferences.allergies.map(allergy => (
                <span key={allergy} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                  No {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No products found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </main>

      <UserPreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSave={handleSavePreferences}
      />

      <ScanModal
        isOpen={showScan}
        onClose={() => setShowScan(false)}
      />
    </div>
  );
}