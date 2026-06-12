import { useState, useEffect } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { ProductCard } from './components/ProductCard';
import { UserPreferencesModal } from './components/UserPreferencesModal';
import { ScanModal } from './components/ScanModal';
import { AuthPage } from './components/AuthPage';
import { Products } from './components/Products';
import { Profile } from './components/Profile';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('ingredia_session'));
  const [currentUserName, setCurrentUserName] = useState(() => localStorage.getItem('ingredia_name') || '');
  const [currentUserRole, setCurrentUserRole] = useState(() => localStorage.getItem('ingredia_role') || 'explorer');
  const [showDashboard, setShowDashboard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>(() => {
    const saved = localStorage.getItem('ingredia_preferences');
    return saved ? JSON.parse(saved) : null;
  });
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  function handleLogin(email: string, name: string) {
    localStorage.setItem('ingredia_session', email);
    localStorage.setItem('ingredia_name', name);
    setCurrentUser(email);
    setCurrentUserName(name);
  }

  function handleLogout() {
    localStorage.removeItem('ingredia_session');
    localStorage.removeItem('ingredia_name');
    setCurrentUser(null);
    setCurrentUserName('');
    setCurrentUserRole('explorer');
  }

  // Fetch products - on login load defaults, on search debounce 500ms
  useEffect(() => {
    if (!currentUser) return;
    const query = searchQuery.trim();
    const delay = query ? 500 : 0; // instant on login, debounced on search
    const timer = setTimeout(() => {
      setLoadingProducts(true);
      fetch(`http://localhost:5000/api/products?q=${encodeURIComponent(query || 'cereal')}`)
        .then(r => r.json())
        .then(data => {
          const mapped = (Array.isArray(data) ? data : []).map((p: any) => ({
            id: String(p._id ?? Math.random()),
            name: p.name || 'Unknown',
            brand: p.brand || '',
            category: p.category || 'Food',
            image: p.image || '',
            score: p.score ?? 50,
            negatives: p.negatives ?? [],
            positives: p.positives ?? [],
            ingredients: p.ingredients_raw
              ? p.ingredients_raw.split(',').map((s: string) => s.trim()).filter(Boolean)
              : [],
          }));
          setAllProducts(mapped);
        })
        .catch(() => setAllProducts([]))
        .finally(() => setLoadingProducts(false));
    }, delay);
    return () => clearTimeout(timer);
  }, [currentUser, searchQuery]);

  useEffect(() => {
    if (!currentUser) {
      setShowPreferences(true);
    }
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (userPreferences) {
      filtered = filtered.map(product => {
        let adjustedScore = product.score;
        const newNegatives = [...product.negatives];

        product.ingredients.forEach((ingredient: string) => {
          userPreferences.allergies.forEach((allergen: string) => {
            if (ingredient.toLowerCase().includes(allergen.toLowerCase())) {
              adjustedScore = Math.max(0, adjustedScore - 30);
              newNegatives.unshift({ icon: 'plus', label: 'Contains allergen', value: `Contains ${allergen}`, severity: 'high' });
            }
          });
        });

        product.ingredients.forEach((ingredient: string) => {
          userPreferences.avoidIngredients.forEach((avoid: string) => {
            if (ingredient.toLowerCase().includes(avoid.toLowerCase())) {
              adjustedScore = Math.max(0, adjustedScore - 15);
              if (!newNegatives.some((n: any) => n.label === 'Unwanted ingredient')) {
                newNegatives.unshift({ icon: 'plus', label: 'Unwanted ingredient', value: `Contains ${avoid}`, severity: 'medium' });
              }
            }
          });
        });

        return { ...product, score: adjustedScore, negatives: newNegatives };
      });
    }

    setFilteredProducts(filtered);
  }, [allProducts, userPreferences]);

  const handleProfileUpdate = (name: string) => {
    setCurrentUserName(name);
  };

  const handleSavePreferences = (preferences: any) => {
    setUserPreferences(preferences);
    localStorage.setItem('ingredia_preferences', JSON.stringify(preferences));
  };

  const handleProductClick = (productId: string | number) => {
    const product = filteredProducts.find((p: any) => p.id === String(productId));
    setSelectedProduct(product || null);
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar
        onSearchChange={setSearchQuery}
        // onScanClick={() => setShowScan(true)}
        onProfileClick={() => setShowProfile(true)}
        currentUser={currentUser}
        currentUserName={currentUserName}
        currentUserRole={currentUserRole}
        onDashboardClick={() => setShowDashboard(true)}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-md px-4 py-5">
        <section className="mb-5 rounded-3xl bg-green-600 p-5 text-white shadow-sm">
          <p className="text-sm text-green-50">Welcome back{currentUserName ? `, ${currentUserName}` : ''}</p>
          <h2 className="mt-1 text-2xl font-bold">Find healthier products</h2>
          <p className="mt-2 text-sm leading-relaxed text-green-50">
            Search, scan, and compare products based on ingredients, additives, and your preferences.
          </p>
          {/* <button
            onClick={() => setShowScan(true)}
            className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-semibold text-green-700 shadow-sm transition hover:bg-green-50"
          >
            Scan a Product
          </button> */}
        </section>

        {userPreferences && (userPreferences.dietaryRestrictions.length > 0 || userPreferences.allergies.length > 0) && (
          <section className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Active Preferences</h3>
                <p className="text-xs text-gray-500">Scores are personalized for you.</p>
              </div>
              <button onClick={() => setShowPreferences(true)} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200">
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {userPreferences.dietaryRestrictions.map((dr: string) => (
                <span key={dr} className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{dr}</span>
              ))}
              {userPreferences.allergies.map((allergy: string) => (
                <span key={allergy} className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">No {allergy}</span>
              ))}
            </div>
          </section>
        )}

        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Products</h2>
            <p className="text-sm text-gray-500">
              {loadingProducts ? 'Loading...' : `${filteredProducts.length} products found`}
            </p>
          </div>
          <button onClick={() => setShowPreferences(true)} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100 hover:bg-gray-50">
            Preferences
          </button>
        </div>

        {loadingProducts ? (
          <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm">
            <p className="font-semibold text-gray-900">No products found</p>
            <p className="mt-1 text-sm text-gray-500">Try a different search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} onClick={handleProductClick} />
            ))}
          </div>
        )}
      </main>

      <UserPreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSave={handleSavePreferences}
      />

      {/* <ScanModal isOpen={showScan} onClose={() => setShowScan(false)} /> */}

      <Products
        product={selectedProduct}
        currentUser={currentUser || ""}
        currentUserRole={currentUserRole}
        onClose={() => setSelectedProduct(null)}
      />
      <Profile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        currentUser={currentUser}
        currentUserName={currentUserName}
        currentUserRole={currentUserRole}
        onDashboardClick={() => setShowDashboard(true)}
        onProfileUpdate={handleProfileUpdate}
      />
      <Dashboard
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        currentUser={currentUser || ""}
      />
    </div>
  );
}