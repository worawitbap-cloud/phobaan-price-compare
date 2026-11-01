import { useMemo, useState } from 'react'

const defaultProducts = [
  {
    id: 1,
    name: 'น้ำยาซักผ้า',
    type: 'volume',
    amount: 1500,
    unit: 'ml',
    price: 129,
  },
  {
    id: 2,
    name: 'น้ำยาปรับผ้านุ่ม',
    type: 'volume',
    amount: 1000,
    unit: 'ml',
    price: 99,
  },
  {
    id: 3,
    name: 'ผงซักฟอก',
    type: 'weight',
    amount: 1,
    unit: 'kg',
    price: 149,
  },
]

const measureOptions = {
  volume: [
    { value: 'ml', label: 'มล.' },
    { value: 'l', label: 'ลิตร' },
  ],
  weight: [
    { value: 'g', label: 'กรัม' },
    { value: 'kg', label: 'กก.' },
  ],
}

function normalizeToBase(type, amount, unit) {
  const value = Number(amount)
  if (!value || value <= 0) return 0

  if (type === 'volume') {
    const map = {
      ml: value / 1000,
      l: value,
    }
    return map[unit] ?? 0
  }

  if (type === 'weight') {
    const map = {
      g: value / 1000,
      kg: value,
    }
    return map[unit] ?? 0
  }

  return 0
}

function getUnitLabel(type) {
  return type === 'volume' ? 'ลิตร' : 'กก.'
}

function getPricePerUnitLabel(type) {
  return type === 'volume' ? 'บาท/ลิตร' : 'บาท/กก.'
}

function formatPrice(value) {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function App() {
  const [products, setProducts] = useState(defaultProducts)

  const updateProduct = (id, field, value) => {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== id) return product

        const updated = { ...product, [field]: value }

        if (field === 'type') {
          updated.unit = value === 'volume' ? 'ml' : 'g'
        }

        return updated
      })
    )
  }

  const addProduct = () => {
    setProducts((current) => [
      ...current,
      {
        id: Date.now() + Math.random(),
        name: '',
        type: 'volume',
        amount: 1,
        unit: 'ml',
        price: 0,
      },
    ])
  }

  const removeProduct = (id) => {
    setProducts((current) => {
      if (current.length === 1) {
        alert('ต้องมีรายการเปรียบเทียบอย่างน้อย 1 รายการ')
        return current
      }
      return current.filter((product) => product.id !== id)
    })
  }

  const summary = useMemo(() => {
    const validProducts = products
      .map((product) => {
        const name = product.name.trim()
        const amount = Number(product.amount)
        const price = Number(product.price)

        if (!name || !amount || amount <= 0 || !price || price <= 0) {
          return null
        }

        const baseAmount = normalizeToBase(product.type, amount, product.unit)
        const pricePerUnit = baseAmount > 0 ? price / baseAmount : 0

        return {
          ...product,
          name,
          pricePerUnit,
          label: getPricePerUnitLabel(product.type),
        }
      })
      .filter(Boolean)

    const groups = ['volume', 'weight']
      .map((type) => {
        const ranked = validProducts
          .filter((product) => product.type === type)
          .sort((a, b) => a.pricePerUnit - b.pricePerUnit)
        return { type, ranked, cheapest: ranked[0] ?? null }
      })
      .filter((group) => group.ranked.length > 0)

    return { groups }
  }, [products])

  return (
    <div className="page-shell">
      <div className="container">
        <header className="topbar">
          <div>
            <p className="eyebrow">Household Price Comparison</p>
            <h1>พ่อบ้านเทียบราคา</h1>
          </div>
          <button className="primary-btn" onClick={addProduct}>
            + เพิ่มรายการเปรียบเทียบ
          </button>
        </header>

        <section className="product-grid">
          {products.map((product, index) => {
            const amount = Number(product.amount)
            const price = Number(product.price)
            const baseAmount = normalizeToBase(product.type, amount, product.unit)
            const pricePerUnit = baseAmount > 0 && price > 0 ? price / baseAmount : 0

            return (
              <article key={product.id} className="product-card">
                <div className="card-header">
                  <h2>รายการที่ {index + 1}</h2>
                  {products.length > 1 && (
                    <button className="remove-btn" onClick={() => removeProduct(product.id)}>
                      ลบ
                    </button>
                  )}
                </div>

                <div className="field-group">
                  <label>ชื่อสินค้า</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                    placeholder="เช่น น้ำยาซักผ้า"
                  />
                </div>

                <div className="field-group">
                  <label>ประเภทการวัด</label>
                  <select
                    value={product.type}
                    onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                  >
                    <option value="volume">ปริมาตร</option>
                    <option value="weight">น้ำหนัก</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>ปริมาณ / น้ำหนัก</label>
                  <div className="two-cols">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={product.amount}
                      onChange={(e) => updateProduct(product.id, 'amount', e.target.value)}
                    />
                    <select
                      value={product.unit}
                      onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                    >
                      {measureOptions[product.type].map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label>ราคา (บาท)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={product.price}
                    onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="result-box">
                  ราคาต่อหน่วย: {pricePerUnit > 0 ? `${formatPrice(pricePerUnit)} ${getPricePerUnitLabel(product.type)}` : '-'}
                </div>
              </article>
            )
          })}
        </section>

        <section className="summary-box">
          <h2>📊 สรุปผลการเปรียบเทียบ</h2>
          {summary.groups.length > 0 ? (
            <>
              {summary.groups.length > 1 && (
                <p className="summary-note">
                  สินค้าวัดตามปริมาตรและน้ำหนักเทียบกันตรง ๆ ไม่ได้ จึงแยกจัดอันดับตามประเภทการวัด
                </p>
              )}
              {summary.groups.map((group) => (
                <div key={group.type} className="summary-group">
                  <h3>{group.type === 'volume' ? 'วัดตามปริมาตร' : 'วัดตามน้ำหนัก'}</h3>
                  <p>
                    <strong>คุ้มที่สุด:</strong> {group.cheapest.name} -{' '}
                    {formatPrice(group.cheapest.pricePerUnit)} {group.cheapest.label}
                  </p>
                  <p>
                    <strong>อันดับความคุ้ม:</strong>{' '}
                    {group.ranked
                      .map((item, index) => `${index + 1}. ${item.name} (${formatPrice(item.pricePerUnit)} ${item.label})`)
                      .join(' | ')}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <p>กรุณากรอกข้อมูลสินค้าและราคาให้ครบถ้วนก่อนสรุปผล</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
