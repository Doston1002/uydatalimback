import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { BooksService } from '../books/books.service';

async function fixBooksPdfUrls() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const booksService = app.get(BooksService);

  try {
    console.log("📚 Kitoblar PDF URL larini to'g'irlash boshlandi...\n");

    // Barcha kitoblarni olish
    const books = await booksService.findAll();
    console.log(`Jami kitoblar: ${books.length}`);

    let fixedCount = 0;

    for (const book of books) {
      let needsUpdate = false;
      const updates: any = {};

      // PDF URL ni tekshirish
      if (book.pdf) {
        const pdfUrl = book.pdf;

        // Agar URL to'liq bo'lmasa va / bilan boshlanmasa
        if (
          !pdfUrl.startsWith('http://') &&
          !pdfUrl.startsWith('https://') &&
          !pdfUrl.startsWith('/')
        ) {
          // Agar fayl nomi o'xshash bo'lsa, books papkasiga qo'yish
          updates.pdf = `/books/${pdfUrl}`;
          needsUpdate = true;

          console.log(`\n📄 To'g'irlanmoqda: ${book.title}`);
          console.log(`   Eski PDF: ${pdfUrl}`);
          console.log(`   Yangi PDF: ${updates.pdf}`);
        }
      }

      // Agar yangilanish kerak bo'lsa
      if (needsUpdate) {
        await booksService.update(book._id.toString(), updates);
        fixedCount++;
        console.log(`   ✅ To'g'irlandi`);
      }
    }

    console.log(`\n\n✅ Tugadi! Jami to'g'irlandi: ${fixedCount} ta kitob`);
  } catch (error) {
    console.error('❌ Xatolik:', error);
  } finally {
    await app.close();
  }
}

// Script ni ishga tushirish
fixBooksPdfUrls();
