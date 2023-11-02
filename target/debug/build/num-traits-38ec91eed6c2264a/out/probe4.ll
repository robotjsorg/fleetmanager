; ModuleID = 'probe4.a7686e458ee1b5ce-cgu.0'
source_filename = "probe4.a7686e458ee1b5ce-cgu.0"
target datalayout = "e-m:o-i64:64-i128:128-n32:64-S128"
target triple = "arm64-apple-macosx11.0.0"

@alloc_546da2e8c1aa0f765565383ba8a41f4a = private unnamed_addr constant <{ [75 x i8] }> <{ [75 x i8] c"/rustc/cae0791da47bb01f16885eb233dcd66b0093a6e1/library/core/src/num/mod.rs" }>, align 1
@alloc_b6f0dbc5c35e9aaa72d0b407a914b97a = private unnamed_addr constant <{ ptr, [16 x i8] }> <{ ptr @alloc_546da2e8c1aa0f765565383ba8a41f4a, [16 x i8] c"K\00\00\00\00\00\00\00v\04\00\00\05\00\00\00" }>, align 8
@str.0 = internal constant [25 x i8] c"attempt to divide by zero"

; probe4::probe
; Function Attrs: uwtable
define void @_ZN6probe45probe17hd6e4dc34890706c4E() unnamed_addr #0 {
start:
  %0 = call i1 @llvm.expect.i1(i1 false, i1 false)
  br i1 %0, label %panic.i, label %"_ZN4core3num21_$LT$impl$u20$u32$GT$10div_euclid17hc13199f84c2cd14bE.exit"

panic.i:                                          ; preds = %start
; call core::panicking::panic
  call void @_ZN4core9panicking5panic17h1b32b5a3057b827eE(ptr align 1 @str.0, i64 25, ptr align 8 @alloc_b6f0dbc5c35e9aaa72d0b407a914b97a) #3
  unreachable

"_ZN4core3num21_$LT$impl$u20$u32$GT$10div_euclid17hc13199f84c2cd14bE.exit": ; preds = %start
  ret void
}

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(none)
declare i1 @llvm.expect.i1(i1, i1) #1

; core::panicking::panic
; Function Attrs: cold noinline noreturn uwtable
declare void @_ZN4core9panicking5panic17h1b32b5a3057b827eE(ptr align 1, i64, ptr align 8) unnamed_addr #2

attributes #0 = { uwtable "frame-pointer"="non-leaf" "target-cpu"="apple-m1" }
attributes #1 = { nocallback nofree nosync nounwind willreturn memory(none) }
attributes #2 = { cold noinline noreturn uwtable "frame-pointer"="non-leaf" "target-cpu"="apple-m1" }
attributes #3 = { noreturn }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.75.0-nightly (cae0791da 2023-10-05)"}
