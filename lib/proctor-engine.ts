/**
 * Proctoring Engine v1.0.0
 * Robust WebRTC & Signaling Controller for Secure Assessments
 */

import { io, Socket } from "socket.io-client";

export interface ProctorConfig {
    userId: string;
    userName: string;
    examTitle: string;
    onStreamStatus: (active: boolean) => void;
    onHubStatus: (connected: boolean) => void;
    videoElement?: HTMLVideoElement | null;
}

class ProctoringEngine {
    private socket: Socket | null = null;
    private peer: RTCPeerConnection | null = null;
    private stream: MediaStream | null = null;
    private config: ProctorConfig;

    constructor(config: ProctorConfig) {
        this.config = config;
    }

    public async initialize() {
        console.log("PROCTOR_ENGINE: Initializing Secure Terminal...");
        await this.initSignaling();
        await this.initMedia();
    }

    private async initSignaling() {
        try {
            // Attempt connection to the current origin
            this.socket = io({
                reconnection: true,
                reconnectionAttempts: 20,
                reconnectionDelay: 1000,
                transports: ["websocket", "polling"]
            });

            this.socket.on("connect", () => {
                console.log("PROCTOR_ENGINE: Signaling Hub Secured -", this.socket?.id);
                this.config.onHubStatus(true);
                this.socket?.emit("proctor:join", {
                    id: this.config.userId,
                    name: this.config.userName,
                    exam: this.config.examTitle
                });
            });

            this.socket.on("disconnect", () => {
                console.warn("PROCTOR_ENGINE: Signaling Hub Severed");
                this.config.onHubStatus(false);
            });

            this.socket.on("connect_error", (error) => {
                console.error("PROCTOR_ENGINE: Hub Connection Error", error.message);
                this.config.onHubStatus(false);
            });

            this.setupWebRTCListeners();

        } catch (err) {
            console.error("PROCTOR_ENGINE: Signaling Initialization Failure", err);
            this.config.onHubStatus(false);
        }
    }

    private async initMedia() {
        console.log("PROCTOR_ENGINE: Negotiating Media Access...");
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("PROCTOR_ENGINE: Media Hardware Interface Missing (Check HTTPS)");
            this.config.onStreamStatus(false);
            return;
        }

        const constraints = [
            { video: true, audio: false },
            { video: { width: 640, height: 480 }, audio: false },
            { video: { width: 320, height: 240 }, audio: false }
        ];

        for (const constraint of constraints) {
            try {
                this.stream = await navigator.mediaDevices.getUserMedia(constraint);
                console.log("PROCTOR_ENGINE: Media Hardware Secured", constraint);
                
                if (this.config.videoElement) {
                    this.config.videoElement.srcObject = this.stream;
                }
                
                this.config.onStreamStatus(true);
                return;
            } catch (e) {
                console.warn("PROCTOR_ENGINE: Media Constraint Refused", constraint);
            }
        }

        console.error("PROCTOR_ENGINE: Total Media Acquisition Failure");
        this.config.onStreamStatus(false);
    }

    private setupWebRTCListeners() {
        if (!this.socket) return;

        this.socket.on("proctor:offer", async ({ from, offer }) => {
            console.log("PROCTOR_ENGINE: Incoming Peer Offer - Remote Proctor");
            
            this.peer = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
            });

            if (this.stream) {
                this.stream.getTracks().forEach(track => this.peer?.addTrack(track, this.stream!));
            }

            this.peer.onicecandidate = (e) => {
                if (e.candidate) {
                    this.socket?.emit("proctor:ice-candidate", { to: from, candidate: e.candidate });
                }
            };

            try {
                await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await this.peer.createAnswer();
                await this.peer.setLocalDescription(answer);
                this.socket?.emit("proctor:answer", { to: from, answer });
            } catch (err) {
                console.error("PROCTOR_ENGINE: WebRTC Negotiation Failed", err);
            }
        });

        this.socket.on("proctor:ice-candidate", async ({ candidate }) => {
            if (this.peer) {
                try {
                    await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error("PROCTOR_ENGINE: ICE Injection Failed", e);
                }
            }
        });
    }

    public terminate() {
        console.log("PROCTOR_ENGINE: Terminating Secure Node...");
        this.socket?.disconnect();
        this.peer?.close();
        this.stream?.getTracks().forEach(track => track.stop());
    }
}

export default ProctoringEngine;
