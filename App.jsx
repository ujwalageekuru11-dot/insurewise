import { useEffect, useState } from "react";
import insurancePlans from "./data/insurancePlans.js";

const categories = [
  { name: "Life Insurance", icon: "🛡️", text: "Protect your family's future" },
  { name: "Health Insurance", icon: "💚", text: "Plan for medical expenses" },
  { name: "Vehicle Insurance", icon: "🚗", text: "Protect your vehicle" },
  { name: "Travel Insurance", icon: "✈️", text: "Travel with confidence" },
];

function PlanCard({ plan, isFavorite, isCompared, onFavorite, onCompare, onDetails }) {
  return (
    <article className="plan-card">
      <div className="card-top">
        <span className="plan-badge">{plan.category}</span>
        <button
          className={`heart-button ${isFavorite ? "active" : ""}`}
          onClick={() => onFavorite(plan.id)}
          aria-label="Add or remove favorite"
          title="Add or remove favorite"
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <h3>{plan.name}</h3>
      <p className="provider">{plan.provider}</p>
      <p className="plan-description">{plan.description}</p>

      <div className="plan-numbers">
        <div>
          <span className="number-label">Monthly premium</span>
          <strong>₹{plan.premium.toLocaleString("en-IN")}</strong>
        </div>
        <div>
          <span className="number-label">Coverage</span>
          <strong>₹{plan.coverage.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      <div className="card-actions">
        <button className="button button-light" onClick={() => onDetails(plan)}>
          View details
        </button>
        <button
          className={`button ${isCompared ? "button-selected" : "button-primary"}`}
          onClick={() => onCompare(plan)}
        >
          {isCompared ? "Selected" : "Compare"}
        </button>
      </div>
    </article>
  );
}

function PolicyCard({ policy, onDetails }) {
  const name =
    policy.name || policy.policy_name || policy.product_name || policy.title || "Insurance policy";
  const provider =
    policy.provider || policy.company_name || policy.insurer || policy.insurance_company || "";
  const category =
    policy.category || policy.insurance_type || policy.policy_type || policy.type || "Insurance";
  const uin = policy.uin || policy.UIN || policy.unique_identification_number || "";

  return (
    <article className="policy-card">
      <div className="policy-icon">📄</div>
      <div className="policy-content">
        <span className="plan-badge">{String(category)}</span>
        <h3>{String(name)}</h3>
        <p className="provider">{provider ? String(provider) : "Provider details not available"}</p>
        {uin && <p className="policy-uin">UIN: {String(uin)}</p>}
        <button className="button button-light details-button" onClick={() => onDetails(policy)}>
          View API details
        </button>
      </div>
    </article>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [comparePlans, setComparePlans] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);

  const [policies, setPolicies] = useState([]);
  const [apiSearch, setApiSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const response = await fetch("https://indiainsurances.com/api/v1/policies");

        if (!response.ok) {
          throw new Error("Could not load policies from the API.");
        }

        const data = await response.json();
        // The API returns the policy list inside its results property.
        setPolicies(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        setError("The live policy list could not be loaded. You can still explore the sample plans below.");
      } finally {
        setLoading(false);
      }
    }

    fetchPolicies();
  }, []);

  const filteredPlans = insurancePlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || plan.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const filteredPolicies = policies.filter((policy) => {
    return JSON.stringify(policy).toLowerCase().includes(apiSearch.trim().toLowerCase());
  });

  const favoritePlans = insurancePlans.filter((plan) => favorites.includes(plan.id));

  function toggleFavorite(planId) {
    if (favorites.includes(planId)) {
      setFavorites(favorites.filter((id) => id !== planId));
    } else {
      setFavorites([...favorites, planId]);
    }
  }

  function toggleCompare(plan) {
    const alreadySelected = comparePlans.some((item) => item.id === plan.id);

    if (alreadySelected) {
      setComparePlans(comparePlans.filter((item) => item.id !== plan.id));
    } else if (comparePlans.length < 3) {
      setComparePlans([...comparePlans, plan]);
    } else {
      window.alert("You can compare up to 3 plans at a time.");
    }
  }

  function showPlanDetails(plan) {
    setSelectedDetails({ kind: "sample", item: plan });
  }

  function showPolicyDetails(policy) {
    setSelectedDetails({ kind: "api", item: policy });
  }

  function closeDetails() {
    setSelectedDetails(null);
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">✦</span>
          <span>InsureWise</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#explore">Explore Plans</a>
          <a href="#api-policies">Live Policies</a>
          <a href="#compare">Compare</a>
          <a href="#favorites">Favorites ({favorites.length})</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">INSURANCE, MADE SIMPLER</span>
            <h1>Make a confident choice for <span>what matters.</span></h1>
            <p>
              Explore insurance options, search policies, and compare sample plans
              in one simple place.
            </p>
            <a className="button button-hero" href="#explore">Explore plans <span>→</span></a>
            <div className="hero-note">
              <span>✓</span> Clear information&nbsp;&nbsp; <span>✓</span> Simple comparison
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-circle circle-one"></div>
            <div className="visual-circle circle-two"></div>
            <div className="shield-card">
              <div className="shield-symbol">✓</div>
              <span className="shield-small">YOUR FUTURE, PROTECTED</span>
              <strong>Peace of mind<br />starts here.</strong>
              <div className="shield-lines"><i></i><i></i><i></i></div>
            </div>
            <div className="floating-chip chip-top">🛡️ Protection</div>
            <div className="floating-chip chip-bottom">♡ Your choices</div>
          </div>
        </section>

        <section className="section category-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">START WITH YOUR NEED</span>
              <h2>What would you like to protect?</h2>
            </div>
            <button className="text-button" onClick={() => { setSelectedCategory("All"); document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" }); }}>
              View all plans <span>→</span>
            </button>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <button
                className={`category-card ${selectedCategory === category.name ? "category-active" : ""}`}
                key={category.name}
                onClick={() => {
                  setSelectedCategory(category.name);
                  document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="category-icon">{category.icon}</span>
                <strong>{category.name}</strong>
                <span className="category-text">{category.text}</span>
                <span className="category-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section plans-section" id="explore">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SAMPLE PLANS</span>
              <h2>Explore insurance plans</h2>
              <p className="section-subtitle">Use search or choose a category to narrow the list.</p>
            </div>
            <span className="result-count">{filteredPlans.length} plans</span>
          </div>

          <div className="search-row">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search plan, provider, or category..."
              />
            </label>
            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} aria-label="Filter by category">
              <option value="All">All categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <p className="sample-note">
            These four plans are illustrative sample data for the project, not real insurance quotes.
          </p>

          {filteredPlans.length > 0 ? (
            <div className="plan-grid">
              {filteredPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isFavorite={favorites.includes(plan.id)}
                  isCompared={comparePlans.some((item) => item.id === plan.id)}
                  onFavorite={toggleFavorite}
                  onCompare={toggleCompare}
                  onDetails={showPlanDetails}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>🔎</span>
              <h3>No sample plans found</h3>
              <p>Try another search term or select all categories.</p>
              <button className="button button-primary" onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}>
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="section api-section" id="api-policies">
          <div className="section-heading">
            <div>
              <span className="eyebrow">API INTEGRATION</span>
              <h2>Search live policy data</h2>
              <p className="section-subtitle">Policies loaded from the IndiaInsurances API, when the service is available.</p>
            </div>
            <span className="api-status"><span className={`status-dot ${loading ? "loading-dot" : error ? "error-dot" : ""}`}></span>{loading ? "Loading" : error ? "Unavailable" : `${policies.length} records loaded`}</span>
          </div>

          <label className="search-box api-search">
            <span>⌕</span>
            <input
              type="text"
              value={apiSearch}
              onChange={(event) => setApiSearch(event.target.value)}
              placeholder="Search API policies by name, type, provider, or keyword..."
            />
          </label>

          {loading && <div className="api-message"><span className="spinner"></span> Loading policies from the API...</div>}
          {!loading && error && <div className="notice notice-warning">{error} Check your internet connection and try refreshing the page.</div>}

          {!loading && !error && (
            <>
              <p className="sample-note">The API may not provide premium, coverage, or every policy detail. Missing values are not guessed.</p>
              {filteredPolicies.length > 0 ? (
                <div className="policy-grid">
                  {filteredPolicies.slice(0, 12).map((policy, index) => (
                    <PolicyCard key={policy.id || policy.uin || index} policy={policy} onDetails={showPolicyDetails} />
                  ))}
                </div>
              ) : (
                <div className="empty-state compact-empty">
                  <span>🔎</span>
                  <h3>No matching API policies</h3>
                  <p>Try a different word, such as health, life, or pension.</p>
                </div>
              )}
              {filteredPolicies.length > 12 && (
                <p className="results-footnote">Showing 12 of {filteredPolicies.length} matching records.</p>
              )}
            </>
          )}
        </section>

        <section className="section compare-section" id="compare">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SIDE-BY-SIDE VIEW</span>
              <h2>Compare your plans</h2>
              <p className="section-subtitle">Select up to three sample plans using the Compare button above.</p>
            </div>
            <span className="result-count">{comparePlans.length}/3 selected</span>
          </div>

          {comparePlans.length > 0 ? (
            <>
              <div className="compare-table-wrap">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th>Plan detail</th>
                      {comparePlans.map((plan) => <th key={plan.id}>{plan.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Category</td>{comparePlans.map((plan) => <td key={plan.id}>{plan.category}</td>)}</tr>
                    <tr><td>Provider</td>{comparePlans.map((plan) => <td key={plan.id}>{plan.provider}</td>)}</tr>
                    <tr><td>Monthly premium</td>{comparePlans.map((plan) => <td key={plan.id}>₹{plan.premium.toLocaleString("en-IN")}</td>)}</tr>
                    <tr><td>Coverage</td>{comparePlans.map((plan) => <td key={plan.id}>₹{plan.coverage.toLocaleString("en-IN")}</td>)}</tr>
                  </tbody>
                </table>
              </div>
              <button className="button button-light clear-compare" onClick={() => setComparePlans([])}>Clear comparison</button>
            </>
          ) : (
            <div className="empty-state">
              <span>⚖️</span>
              <h3>Your comparison is ready to start</h3>
              <p>Choose Compare on any sample plan to add it here.</p>
              <a className="button button-primary" href="#explore">Browse plans</a>
            </div>
          )}
        </section>

        <section className="section favorites-section" id="favorites">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SAVED FOR LATER</span>
              <h2>Your favorite plans</h2>
              <p className="section-subtitle">Keep the sample plans you want to review again.</p>
            </div>
            <span className="result-count">{favoritePlans.length} saved</span>
          </div>

          {favoritePlans.length > 0 ? (
            <div className="plan-grid">
              {favoritePlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isFavorite={true}
                  isCompared={comparePlans.some((item) => item.id === plan.id)}
                  onFavorite={toggleFavorite}
                  onCompare={toggleCompare}
                  onDetails={showPlanDetails}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state compact-empty">
              <span>♡</span>
              <h3>No favorites yet</h3>
              <p>Tap the heart on a sample plan to save it here.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home"><span className="brand-icon">✦</span><span>InsureWise</span></a>
        <p>A student project to make insurance information easier to explore.</p>
        <span>© 2026 InsureWise · Educational demo</span>
      </footer>

      {selectedDetails && (
        <div className="modal-backdrop" onClick={closeDetails}>
          <div className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={closeDetails} aria-label="Close details">×</button>
            {selectedDetails.kind === "sample" ? (
              <>
                <span className="eyebrow">SAMPLE PLAN DETAILS</span>
                <h2 id="details-title">{selectedDetails.item.name}</h2>
                <p className="provider">{selectedDetails.item.provider}</p>
                <p>{selectedDetails.item.description}</p>
                <div className="modal-detail-grid">
                  <div><span>Category</span><strong>{selectedDetails.item.category}</strong></div>
                  <div><span>Monthly premium</span><strong>₹{selectedDetails.item.premium.toLocaleString("en-IN")}</strong></div>
                  <div><span>Coverage</span><strong>₹{selectedDetails.item.coverage.toLocaleString("en-IN")}</strong></div>
                </div>
                <p className="modal-note">This is sample project data, not an actual offer from an insurance company.</p>
              </>
            ) : (
              <>
                <span className="eyebrow">API POLICY DETAILS</span>
                <h2 id="details-title">{String(selectedDetails.item.name || selectedDetails.item.policy_name || selectedDetails.item.product_name || selectedDetails.item.title || "Insurance policy")}</h2>
                <p className="modal-note">These are the fields returned by the API. Some details may not be available.</p>
                <div className="raw-details">
                  {Object.entries(selectedDetails.item).map(([key, value]) => (
                    <div className="raw-detail-row" key={key}>
                      <span>{key.replaceAll("_", " ")}</span>
                      <strong>{value === null || value === "" ? "Not provided" : typeof value === "object" ? JSON.stringify(value) : String(value)}</strong>
                    </div>
                  ))}
                </div>
              </>
            )}
            <button className="button button-primary modal-done" onClick={closeDetails}>Close details</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
