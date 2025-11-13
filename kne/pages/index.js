import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import html2canvas from 'html2canvas'

export default function Home() {
  const [tournamentNumber, setTournamentNumber] = useState('')
  const [tournamentType, setTournamentType] = useState('新人戦')
  const [playerName, setPlayerName] = useState('')
  const [university, setUniversity] = useState('')
  const [role, setRole] = useState('選手')
  const [birthDate, setBirthDate] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [validType, setValidType] = useState('今大会のみ')
  const [validDate, setValidDate] = useState('2024/7/11')
  const [validDateOnly, setValidDateOnly] = useState('2024/7/11')
  const [loading, setLoading] = useState(false)
  const cardRef = useRef(null)

  // 画像ファイルの読み込み
  const [frameImage, setFrameImage] = useState(null)
  const [stampImage, setStampImage] = useState(null)

  // 画像を読み込む
  useEffect(() => {
    const loadImages = async () => {
      try {
        const frame = await loadImage('/e3219de4-86dd-424b-95a8-de7abc55c24b.png')
        const stamp = await loadImage('/78904fc1-bd97-45ea-a6f7-d4237d5cd64b.png')
        setFrameImage(frame)
        setStampImage(stamp)
      } catch (error) {
        console.error('画像の読み込みエラー:', error)
      }
    }
    loadImages()
  }, [])

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const parseDate = (dateStr) => {
    const parts = dateStr.split(/[/\-]/)
    if (parts.length >= 3) {
      return {
        year: parts[0].trim(),
        month: parts[1].trim().replace(/^0+/, ''),
        day: parts[2].trim().replace(/^0+/, '')
      }
    }
    return { year: '', month: '', day: '' }
  }

  const generateCard = async () => {
    if (!playerName || !university || !birthDate) {
      alert('必須項目を入力してください')
      return
    }

    setLoading(true)
    try {
      // カード生成の処理は、HTMLをレンダリングしてからhtml2canvasで変換
      // 実際の生成はuseEffectで行う
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, {
          width: 420,
          height: 272,
          scale: 2,
          backgroundColor: '#c2e8c2'
        })
        
        const link = document.createElement('a')
        link.download = `card_${playerName}_${university}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
    } catch (error) {
      console.error('カード生成エラー:', error)
      alert('カードの生成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const birthDateObj = parseDate(birthDate)
  const validText = validType === '今大会のみ' 
    ? '<span>※</span><strong>今大会</strong><span>のみ有効</span>'
    : `<span>※</span><strong>${validDateOnly}</strong><span>のみ有効</span>`

  return (
    <>
      <Head>
        <title>カード発行システム</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style jsx global>{`
          .valid-row strong {
            font-size: 100px;
            font-weight: bold;
            display: inline-block;
            line-height: 1;
          }
          .valid-row span {
            font-size: 30px;
            display: inline-block;
          }
        `}</style>
      </Head>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>カード発行システム</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* 入力フォーム */}
          <div>
            <h2>入力フォーム</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>大会回数</label>
                <input
                  type="text"
                  value={tournamentNumber}
                  onChange={(e) => setTournamentNumber(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              
              <div>
                <label>大会種別</label>
                <select
                  value={tournamentType}
                  onChange={(e) => setTournamentType(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="新人戦">新人戦</option>
                  <option value="選手権大会">選手権大会</option>
                  <option value="リーグ戦">リーグ戦</option>
                </select>
              </div>
              
              <div>
                <label>氏名</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              
              <div>
                <label>大学名</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              
              <div>
                <label>役職</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label>
                    <input
                      type="radio"
                      value="選手"
                      checked={role === '選手'}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    選手
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="スタッフ"
                      checked={role === 'スタッフ'}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    スタッフ
                  </label>
                </div>
              </div>
              
              <div>
                <label>生年月日 (YYYY/MM/DD)</label>
                <input
                  type="text"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              
              <div>
                <label>顔写真</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              
              <div>
                <label>有効期限</label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                  <label>
                    <input
                      type="radio"
                      value="今大会のみ"
                      checked={validType === '今大会のみ'}
                      onChange={(e) => setValidType(e.target.value)}
                    />
                    今大会のみ
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="特定日付のみ"
                      checked={validType === '特定日付のみ'}
                      onChange={(e) => setValidType(e.target.value)}
                    />
                    特定日付のみ
                  </label>
                </div>
                {validType === '特定日付のみ' && (
                  <input
                    type="text"
                    value={validDateOnly}
                    onChange={(e) => setValidDateOnly(e.target.value)}
                    placeholder="YYYY/MM/DD"
                    style={{ width: '100%', padding: '0.5rem' }}
                  />
                )}
              </div>
              
              <button
                onClick={generateCard}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#1f77b4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {loading ? '生成中...' : 'カードを生成'}
              </button>
            </div>
          </div>
          
          {/* カードプレビュー */}
          <div>
            <h2>プレビュー</h2>
            <div
              ref={cardRef}
              style={{
                width: '420px',
                height: '272px',
                border: '4px solid #222',
                borderTop: '2px solid #222',
                borderBottom: '2px solid #222',
                backgroundColor: '#c2e8c2',
                position: 'relative',
                fontFamily: '"Meiryo", "Segoe UI", sans-serif',
                fontSize: '0.7em',
                lineHeight: '1.1',
                padding: '10px 12px',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
            >
              {/* カードコンテンツ */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: 'calc(100% - 150px)'
              }}>
                <div style={{ 
                  fontSize: '1.4em', 
                  fontWeight: 'bold', 
                  textAlign: 'center', 
                  marginTop: '8px',
                  whiteSpace: 'nowrap',
                  overflow: 'visible'
                }}>
                  {tournamentNumber ? `第${tournamentNumber}回関東大学バスケットボール` : '第回関東大学バスケットボール'}
                </div>
                <div style={{ fontSize: '1.4em', fontWeight: 'bold', textAlign: 'center', marginTop: '6px' }}>
                  {tournamentType}
                </div>
                <div style={{
                  fontSize: '1.15em',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3em',
                  marginTop: '8px',
                  marginBottom: '10px',
                  overflow: 'visible'
                }}>
                  <span style={{ position: 'relative', overflow: 'visible' }}>
                    {role === '選手' && frameImage && (
                      <img
                        src={frameImage.src}
                        alt=""
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '3em',
                          height: '3em',
                          zIndex: 1,
                          pointerEvents: 'none',
                          borderRadius: '50% 50% / 70% 70%',
                          objectFit: 'cover',
                          overflow: 'visible'
                        }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 2, overflow: 'visible' }}>仮選手証</span>
                  </span>
                  <span>　・　</span>
                  <span style={{ position: 'relative', overflow: 'visible' }}>
                    {role === 'スタッフ' && frameImage && (
                      <img
                        src={frameImage.src}
                        alt=""
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '3em',
                          height: '3em',
                          zIndex: 1,
                          pointerEvents: 'none',
                          borderRadius: '50% 50% / 70% 70%',
                          objectFit: 'cover',
                          overflow: 'visible'
                        }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 2, overflow: 'visible' }}>スタッフ証</span>
                  </span>
                </div>
                
                 <div style={{ marginTop: '12px' }}>
                   <div style={{
                     fontSize: '1.2em',
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     position: 'relative',
                     whiteSpace: 'nowrap',
                     overflow: 'visible'
                   }}>
                     <span style={{ whiteSpace: 'nowrap', fontSize: '1.2em' }}>氏名</span>
                     <span style={{
                       position: 'absolute',
                       left: '50%',
                       transform: 'translateX(-50%)',
                       whiteSpace: 'nowrap',
                       fontSize: '1.2em'
                     }}>{playerName || ''}</span>
                   </div>
                   <hr style={{ border: 'none', borderBottom: '2px solid #222', margin: '5px 0 0 0' }} />
                 </div>
                 
                 <div style={{ marginTop: '10px' }}>
                   <div style={{
                     fontSize: '1.2em',
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     position: 'relative',
                     whiteSpace: 'nowrap',
                     overflow: 'visible'
                   }}>
                     <span style={{
                       position: 'absolute',
                       left: '0',
                       right: 'calc(1.2em + 10px)',
                       whiteSpace: 'nowrap',
                       fontSize: '1.2em',
                       textAlign: 'right',
                       overflow: 'visible'
                     }}>{university || ''}</span>
                     <span style={{ marginLeft: 'auto', whiteSpace: 'nowrap', fontSize: '1.2em' }}>大学</span>
                   </div>
                  <hr style={{ border: 'none', borderBottom: '2px solid #222', margin: '5px 0 0 0' }} />
                </div>
                
                <div style={{
                  fontSize: '1.2em',
                  marginTop: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  overflow: 'visible'
                }}>
                  <span style={{ fontSize: '0.85em', whiteSpace: 'nowrap' }}>生年月日</span>
                  <span style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1.2em',
                    whiteSpace: 'nowrap'
                  }}>
                    {birthDate ? `${birthDateObj.year}年${birthDateObj.month}月${birthDateObj.day}日` : ''}
                  </span>
                </div>
                
                <div 
                  className="valid-row"
                  style={{
                    marginTop: '15px',
                    textAlign: 'center',
                    fontSize: '1em'
                  }}
                >
                  {validType === '今大会のみ' ? (
                    <>
                      <span style={{ fontSize: '1.5em' }}>※</span>
                      <strong style={{ fontSize: '1.5em', fontWeight: 'bold', display: 'inline-block', lineHeight: 1 }}>今大会</strong>
                      <span style={{ fontSize: '1.5em' }}>のみ有効</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '1.5em' }}>※</span>
                      <strong style={{ fontSize: '1.5em', fontWeight: 'bold', display: 'inline-block', lineHeight: 1 }}>{validDateOnly}</strong>
                      <span style={{ fontSize: '1.5em' }}>のみ有効</span>
                    </>
                  )}
                </div>
                
                <div style={{
                  fontSize: '0.5em',
                  position: 'absolute',
                  right: '10px',
                  bottom: '8px',
                  textAlign: 'right'
                }}>
                  一般社団法人関東大学バスケットボール連盟
                </div>
              </div>
              
              {/* 写真フレーム */}
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '45px',
                width: '130px',
                height: '180px',
                border: '2px solid #000',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '0.65em', color: '#222' }}>写真</span>
                )}
              </div>
              
              {/* 印鑑 */}
              {stampImage && (
                <img
                  src={stampImage.src}
                  alt=""
                  style={{
                    position: 'absolute',
                    right: '80px',
                    top: '65px',
                    width: '110px',
                    height: '110px',
                    opacity: 0.9,
                    pointerEvents: 'none',
                    zIndex: 30
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}



