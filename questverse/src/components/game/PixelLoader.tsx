/**
 * PixelLoader - 全屏加载界面
 * 模拟 8-bit 启动屏的复古氛围
 */

export function PixelLoader() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* CRT 扫描线层 */}
      <div className="crt-scanlines absolute inset-0 z-10" />
    </div>
  );
}
