# Docs Definition of Done

Dùng checklist này trước khi kết thúc task có thay đổi behavior, kiến trúc, hoặc quy trình.

## 1) Accuracy

- [ ] Mô tả trong docs khớp với code hiện tại (không ghi "đề xuất" như thể đã triển khai).
- [ ] Đường dẫn file/cấu trúc thư mục trong docs đang đúng.
- [ ] Luật gameplay chính (điểm, mở khóa, flow màn hình) không mâu thuẫn giữa các tài liệu.

## 2) Scope separation

- [ ] Phân tách rõ:
  - tài liệu hiện trạng (as-is),
  - tài liệu mục tiêu/tầm nhìn (to-be).
- [ ] Nếu có gap giữa BRD và hiện trạng, đã ghi chú rõ trong docs.

## 3) Required updates

- [ ] Đã cập nhật `docs/status/CURRENT_STATE.md` nếu task làm thay đổi trạng thái hệ thống.
- [ ] Đã cập nhật một trong các tài liệu liên quan:
  - `docs/requirements/TECHNICAL_REQUIREMENTS.md`
  - `docs/planning/IMPLEMENTATION_ROADMAP.md`
  - `docs/workflow/DEVELOPMENT_WORKFLOW.md`
- [ ] Nếu thay đổi thuật ngữ, đã cập nhật `docs/GLOSSARY.md`.

## 4) Verification

- [ ] Đã chạy `npm run build` và pass.
- [ ] Đã kiểm thử smoke theo `docs/workflow/DEVELOPMENT_WORKFLOW.md`.
- [ ] Không còn mâu thuẫn rõ ràng giữa `README.md` và `docs/README.md`.
