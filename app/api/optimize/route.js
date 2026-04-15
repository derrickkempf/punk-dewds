import { optimize } from 'svgo'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { svg } = await req.json()

    if (!svg || typeof svg !== 'string') {
      return NextResponse.json({ error: 'Missing svg field' }, { status: 400 })
    }

    const result = optimize(svg, {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
              cleanupIds: false,
            },
          },
        },
        'removeDimensions',
        {
          name: 'removeAttrs',
          params: { attrs: ['data-name', 'class'] },
        },
      ],
    })

    const originalSize = new Blob([svg]).size
    const optimizedSize = new Blob([result.data]).size
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1)

    return NextResponse.json({
      svg: result.data,
      originalSize,
      optimizedSize,
      savings: `${savings}%`,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
