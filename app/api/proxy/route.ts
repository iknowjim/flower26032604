import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ error: '没有收到图片' }, { status: 400 });
    }

    const newForm = new FormData();
    newForm.append('images', image);

    const response = await fetch(
      `https://my-api.plantnet.org/v2/diseases/identify?api-key=2b10imYwpIAGLH8BX6esVUVBee&include-related-images=true`,
      {
        method: 'POST',
        body: newForm,
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || '服务器错误' }, { status: 500 });
  }
}
