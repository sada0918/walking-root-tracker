import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MapComponent = () => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [path, setPath] = useState([]); // 経路を保存するための配列
    const mapRef = useRef(null);
    const markerRef = useRef(null); // マーカーの参照を保持

    // 位置情報を取得する
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const latLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCurrentPosition(latLng);
                    setPath((prevPath) => [...prevPath, latLng]); // 新しい位置をpathに追加
                },
                (error) => {
                    console.error("位置情報の取得に失敗しました:", error);
                },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        } else {
            alert("このブラウザは位置情報APIに対応していません。");
        }
    }, []);

    // 現在位置が取得できたらマーカーを更新
    useEffect(() => {
        if (window.google && currentPosition && mapRef.current) {
            // マーカーを作成または更新
            if (markerRef.current) {
                markerRef.current.setPosition(currentPosition);
            } else {
                markerRef.current = new window.google.maps.Marker({
                    position: currentPosition,
                    map: mapRef.current,
                });
            }

            // マップの中心を現在位置に更新
            mapRef.current.setCenter(currentPosition);
        }
    }, [currentPosition]);

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100vh' }}
                center={currentPosition || { lat: 35.6895, lng: 139.6917 }} // 初期位置は新宿付近
                zoom={15}
                onLoad={(map) => (mapRef.current = map)} // GoogleMapの読み込み完了後にmapRefを設定
            >
                {/* 現在位置が取得できていればマーカーを表示 */}
                {currentPosition && (
                    <Polyline
                        path={path} // path配列をPolylineに渡す
                        options={{
                            strokeColor: '#FF0000', // 線の色
                            strokeOpacity: 1.0, // 線の透明度
                            strokeWeight: 3, // 線の太さ
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
