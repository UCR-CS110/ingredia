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
  <div className="min-h-screen bg-gray-50">
    <NavigationBar
      onSearchChange={setSearchQuery}
      onScanClick={() => setShowScan(true)}
      currentUser={currentUser}
      onLogout={handleLogout}
    />

    {/* Main Content */}
    <main className="mx-auto max-w-md px-4 py-5">
      {/* Welcome / Summary Card */}
      <section className="mb-5 rounded-3xl bg-green-600 p-5 text-white shadow-sm">
        <p className="text-sm text-green-50">Welcome back</p>
        <h2 className="mt-1 text-2xl font-bold">Find healthier products</h2>
        <p className="mt-2 text-sm leading-relaxed text-green-50">
          Search, scan, and compare products based on ingredients, additives,
          and your preferences.
        </p>

        <button
          onClick={() => setShowScan(true)}
          className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-semibold text-green-700 shadow-sm transition hover:bg-green-50"
        >
          Scan a Product
        </button>
      </section>

      {/* Active Preferences Banner */}
      {userPreferences &&
        (userPreferences.dietaryRestrictions.length > 0 ||
          userPreferences.allergies.length > 0) && (
          <section className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Active Preferences
                </h3>
                <p className="text-xs text-gray-500">
                  Scores are personalized for you.
                </p>
              </div>

              <button
                onClick={() => setShowPreferences(true)}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {userPreferences.dietaryRestrictions.map((dr) => (
                <span
                  key={dr}
                  className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                >
                  {dr}
                </span>
              ))}

              {userPreferences.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                >
                  No {allergy}
                </span>
              ))}
            </div>
          </section>
        )}

      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">
            {filteredProducts.length} products found
          </p>
        </div>

        <button
          onClick={() => setShowPreferences(true)}
          className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100 hover:bg-gray-50"
        >
          Preferences
        </button>
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm">
          <p className="font-semibold text-gray-900">No products found</p>
          <p className="mt-1 text-sm text-gray-500">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
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

    <ScanModal isOpen={showScan} onClose={() => setShowScan(false)} />
  </div>
  );
}