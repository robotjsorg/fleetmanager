use std::{net::SocketAddr, sync::Arc};
use tokio::sync::Mutex;
use hyper::server::conn::AddrIncoming;
use hyper_rustls::TlsAcceptor;
use rustls::{Certificate, PrivateKey, ServerConfig};
use egui::{CentralPanel, Context, Window};
use eframe::egui;

use axum::{
    routing::get,
    Router,
};

#[tokio::main]
async fn main() {
    // Start the Axum web server in a separate task
    tokio::spawn(async {
        start_server().await;
    });

    // Start the egui HTTPS client
    let options = eframe::NativeOptions::default();
    eframe::run_native(
        "HTTPS Client",
        options,
        Box::new(|_cc| Box::new(MyApp::default())),
    );
}

async fn start_server() {
    let app = Router::new().route("/", get(handler));

    // Load TLS certificates
    let cert = include_bytes!("cert.pem");
    let key = include_bytes!("key.pem");
    let config = ServerConfig::builder()
        .with_safe_defaults()
        .with_no_client_auth()
        .with_single_cert(vec![Certificate(cert.to_vec())], PrivateKey(key.to_vec()))
        .expect("Invalid TLS configuration");

    let acceptor = TlsAcceptor::from(Arc::new(config));
    let incoming = AddrIncoming::bind(&SocketAddr::from(([127, 0, 0, 1], 443))).unwrap();
    let incoming = hyper::server::accept::from_stream(incoming.and_then(|conn| async {
        acceptor.accept(conn).await.map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))
    }));

    axum::Server::builder(incoming)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn handler() -> &'static str {
    "Hello, HTTPS World!"
}

#[derive(Default)]
struct MyApp {
    response: Arc<Mutex<String>>,
}

impl eframe::App for MyApp {
    fn update(&mut self, ctx: &Context, _frame: &mut eframe::Frame) {
        CentralPanel::default().show(ctx, |ui| {
            if ui.button("Send Request").clicked() {
                let response = self.response.clone();
                tokio::spawn(async move {
                    let client = reqwest::Client::builder()
                        .danger_accept_invalid_certs(true)
                        .build()
                        .unwrap();
                    let res = client
                        .get("https://127.0.0.1/")
                        .send()
                        .await
                        .unwrap()
                        .text()
                        .await
                        .unwrap();
                    *response.lock().await = res;
                });
            }

            Window::new("Response").show(ctx, |ui| {
                let response = self.response.clone();
                let response = futures::executor::block_on(response.lock());
                ui.label(response.as_str());
            });
        });
    }
}