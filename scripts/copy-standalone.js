const fs = require('fs-extra');
const path = require('path');

async function copyStandalone() {
  try {
    const sourceDir = path.join(__dirname, '..', '.next', 'standalone');
    const staticDir = path.join(__dirname, '..', '.next', 'static');
    const functionsDir = path.join(__dirname, '..', 'functions');
    const functionsStaticDir = path.join(functionsDir, '.next', 'static');
    const functionsLibStaticDir = path.join(functionsDir, 'lib', '.next', 'static');

    // functions 디렉토리가 없으면 생성
    await fs.ensureDir(functionsDir);
    await fs.ensureDir(functionsStaticDir);
    await fs.ensureDir(functionsLibStaticDir);

    // standalone 파일들 복사
    if (await fs.pathExists(sourceDir)) {
      await fs.copy(sourceDir, functionsDir, { overwrite: true });
      console.log('✅ Standalone 파일 복사 완료');
    } else {
      console.log('⚠️ Standalone 디렉토리가 없습니다. Next.js 빌드를 먼저 실행하세요.');
    }

    // static 파일들 복사
    if (await fs.pathExists(staticDir)) {
      await fs.copy(staticDir, functionsStaticDir, { overwrite: true });
      await fs.copy(staticDir, functionsLibStaticDir, { overwrite: true });
      console.log('✅ Static 파일 복사 완료');
    } else {
      console.log('⚠️ Static 디렉토리가 없습니다. Next.js 빌드를 먼저 실행하세요.');
    }

    console.log('🎉 모든 파일 복사 완료!');
  } catch (error) {
    console.error('❌ 파일 복사 중 오류 발생:', error);
    process.exit(1);
  }
}

copyStandalone(); 